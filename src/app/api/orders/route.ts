import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getAuthenticatedCustomer } from '@/lib/auth/customer';
import { getDatabase } from '@/lib/db';
import { DbProduct, DbProductVariant, DbCart, DbCartItem, DbOrder, DbOrderItem } from '@/lib/db/types';
import { triggerNewOrderNotifications } from '@/lib/notifications/service';

// Helper to generate sequential human-readable collision-safe order number
async function generateOrderNumber(db: ReturnType<typeof getDatabase>): Promise<string> {
  const currentYear = new Date().getFullYear();
  const countRow = await db.queryOne<{ cnt: number }>(
    "SELECT COUNT(*) as cnt FROM orders WHERE created_at LIKE ?",
    [`${currentYear}%`]
  );
  let nextSeq = (countRow?.cnt || 0) + 1;

  while (true) {
    const candidate = `ZAI-${currentYear}-${String(nextSeq).padStart(6, '0')}`;
    const exists = await db.queryOne<{ id: string }>(
      'SELECT id FROM orders WHERE order_number = ?',
      [candidate]
    );
    if (!exists) {
      return candidate;
    }
    nextSeq++;
  }
}

// ─── GET /api/orders (List authenticated customer's orders) ───
export async function GET(req: NextRequest) {
  const customer = await getAuthenticatedCustomer(req);
  if (!customer) {
    return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
  }

  try {
    const db = getDatabase();
    const orders = await db.query<DbOrder>(
      `SELECT o.*
       FROM orders o
       WHERE o.user_id = ?
       ORDER BY o.created_at DESC`,
      [customer.id]
    );

    const ordersWithItems = await Promise.all(
      orders.map(async (o) => {
        const items = await db.query<
          DbOrderItem & { product_image: string | null; product_slug: string | null }
        >(
          `SELECT
            oi.*,
            (SELECT image_url FROM product_images WHERE product_id = oi.product_id AND active = 1 ORDER BY is_main DESC, display_order ASC LIMIT 1) as product_image,
            p.slug as product_slug
           FROM order_items oi
           LEFT JOIN products p ON oi.product_id = p.id
           WHERE oi.order_id = ?
           ORDER BY oi.created_at ASC`,
          [o.id]
        );
        return {
          ...o,
          items,
        };
      })
    );

    return NextResponse.json({ orders: ordersWithItems });
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

// ─── POST /api/orders (Create genuine D1 COD Order) ───
export async function POST(req: NextRequest) {
  const customer = await getAuthenticatedCustomer(req);
  if (!customer) {
    return NextResponse.json({ error: 'Unauthorized. Please log in to place an order.' }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const {
      customerName,
      customerPhone,
      customerEmail,
      deliveryAddress,
      city,
      state,
      pincode,
      landmark,
      deliveryOption = 'standard',
      siteVisitDate,
      siteVisitTime,
      notes,
      idempotencyKey,
      paymentMethod = 'COD',
    } = body;

    // 1. Validate required customer information
    if (!customerName || typeof customerName !== 'string' || customerName.trim().length < 2) {
      return NextResponse.json({ error: 'Full name is required (min 2 characters)' }, { status: 400 });
    }

    if (!customerPhone || typeof customerPhone !== 'string' || !/^[0-9+ -]{10,14}$/.test(customerPhone.trim())) {
      return NextResponse.json({ error: 'Valid 10-digit mobile number is required' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const finalEmail = customerEmail ? customerEmail.trim() : customer.email;
    if (!finalEmail || !emailRegex.test(finalEmail)) {
      return NextResponse.json({ error: 'Valid email address is required' }, { status: 400 });
    }

    // 2. Validate delivery address
    if (!deliveryAddress || typeof deliveryAddress !== 'string' || deliveryAddress.trim().length < 5) {
      return NextResponse.json({ error: 'Delivery address is required (min 5 characters)' }, { status: 400 });
    }

    if (!city || typeof city !== 'string' || !city.trim()) {
      return NextResponse.json({ error: 'City is required' }, { status: 400 });
    }

    if (!state || typeof state !== 'string' || !state.trim()) {
      return NextResponse.json({ error: 'State is required' }, { status: 400 });
    }

    if (!pincode || typeof pincode !== 'string' || !/^[0-9]{6}$/.test(pincode.trim())) {
      return NextResponse.json({ error: 'Valid 6-digit PIN code is required' }, { status: 400 });
    }

    // Enforce COD payment method for Stage 4
    if (paymentMethod && paymentMethod.toUpperCase() !== 'COD') {
      return NextResponse.json(
        { error: 'Only Cash on Delivery (COD) is supported in this stage.' },
        { status: 400 }
      );
    }

    const db = getDatabase();

    // 3. Idempotency Check (prevent accidental double-click duplicate orders)
    if (idempotencyKey && typeof idempotencyKey === 'string') {
      const existingOrder = await db.queryOne<DbOrder>(
        'SELECT * FROM orders WHERE user_id = ? AND idempotency_key = ?',
        [customer.id, idempotencyKey.trim()]
      );

      if (existingOrder) {
        const existingItems = await db.query<DbOrderItem>(
          'SELECT * FROM order_items WHERE order_id = ?',
          [existingOrder.id]
        );
        return NextResponse.json({
          success: true,
          order: {
            ...existingOrder,
            orderNumber: existingOrder.order_number,
            totalAmount: existingOrder.total_amount,
            deliveryCharge: existingOrder.delivery_charge,
            customerName: existingOrder.customer_name,
            customerPhone: existingOrder.customer_phone,
            customerEmail: existingOrder.customer_email,
            items: existingItems,
          },
          isDuplicateSubmission: true,
        });
      }
    }

    // 4. Fetch Customer Cart from D1
    const cart = await db.queryOne<DbCart>(
      'SELECT * FROM carts WHERE user_id = ?',
      [customer.id]
    );

    if (!cart) {
      return NextResponse.json(
        { error: 'No active cart found for this account.' },
        { status: 400 }
      );
    }

    const cartItems = await db.query<DbCartItem>(
      'SELECT * FROM cart_items WHERE cart_id = ?',
      [cart.id]
    );

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Your cart is empty. Please add products before placing an order.' },
        { status: 400 }
      );
    }

    // 5. Server-Side Verification of each cart item against D1 catalog
    interface ValidatedOrderItem {
      productId: string;
      variantId: string | null;
      productName: string;
      variantName: string | null;
      quantity: number;
      unitPrice: number;
      lineTotal: number;
      customizationData: string | null;
      productType: string;
    }

    const validatedItems: ValidatedOrderItem[] = [];
    let calculatedSubtotal = 0;

    for (const item of cartItems) {
      // Re-fetch product
      const product = await db.queryOne<DbProduct>(
        'SELECT * FROM products WHERE id = ?',
        [item.product_id]
      );

      if (!product || product.active !== 1) {
        return NextResponse.json(
          { error: `Product "${product?.name || item.product_id}" is currently unavailable.` },
          { status: 400 }
        );
      }

      // Re-fetch variant if present
      let variantName: string | null = null;
      let variantPriceAdj = 0;

      if (item.variant_id) {
        const variant = await db.queryOne<DbProductVariant>(
          'SELECT * FROM product_variants WHERE id = ? AND product_id = ? AND active = 1',
          [item.variant_id, item.product_id]
        );

        if (!variant) {
          return NextResponse.json(
            { error: `Selected variant for "${product.name}" is no longer available.` },
            { status: 400 }
          );
        }

        variantName = variant.name;
        variantPriceAdj = variant.price_adjustment || 0;
      }

      // Calculate server unit price snapshot (catalog truth, never client truth)
      const unitPrice = Math.max(0, product.base_price + variantPriceAdj);
      const lineTotal = unitPrice * item.quantity;
      calculatedSubtotal += lineTotal;

      validatedItems.push({
        productId: product.id,
        variantId: item.variant_id || null,
        productName: product.name,
        variantName,
        quantity: item.quantity,
        unitPrice,
        lineTotal,
        customizationData: item.customization_data || null,
        productType: product.product_type || 'standard',
      });
    }

    // 6. Calculate Order Totals
    const subtotal = calculatedSubtotal;
    const discount = 0;
    const deliveryCharge = 0;
    const totalAmount = subtotal + deliveryCharge - discount;

    // 7. Generate IDs and Order Number
    const orderId = `ord-${crypto.randomBytes(8).toString('hex')}`;
    const orderNumber = await generateOrderNumber(db);
    const siteVisitRequired = deliveryOption === 'service_visit' ? 1 : 0;

    // 8. Atomic Database Transaction
    await db.execute('BEGIN TRANSACTION');

    try {
      // Insert Order record
      await db.execute(
        `INSERT INTO orders (
          id, order_number, user_id, status, payment_method, payment_status,
          customer_name, customer_email, customer_phone, delivery_address,
          city, state, pincode, landmark, delivery_option, site_visit_required,
          site_visit_date, site_visit_time, subtotal, discount, delivery_charge,
          total_amount, notes, idempotency_key, created_at, updated_at
        ) VALUES (?, ?, ?, 'CONFIRMED', 'COD', 'PENDING', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
        [
          orderId,
          orderNumber,
          customer.id,
          customerName.trim(),
          finalEmail,
          customerPhone.trim(),
          deliveryAddress.trim(),
          city.trim(),
          state.trim(),
          pincode.trim(),
          landmark ? landmark.trim() : null,
          deliveryOption,
          siteVisitRequired,
          siteVisitDate || null,
          siteVisitTime || null,
          subtotal,
          discount,
          deliveryCharge,
          totalAmount,
          notes ? notes.trim() : null,
          idempotencyKey ? idempotencyKey.trim() : null,
        ]
      );

      // Insert Order Items with complete historical snapshots
      for (const item of validatedItems) {
        const itemId = `oi-${crypto.randomBytes(8).toString('hex')}`;
        await db.execute(
          `INSERT INTO order_items (
            id, order_id, product_id, variant_id, product_name_snapshot,
            variant_name_snapshot, quantity, unit_price_snapshot, line_total,
            customization_data, product_type, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
          [
            itemId,
            orderId,
            item.productId,
            item.variantId,
            item.productName,
            item.variantName,
            item.quantity,
            item.unitPrice,
            item.lineTotal,
            item.customizationData,
            item.productType,
          ]
        );
      }

      // Clear customer's purchased cart items
      await db.execute('DELETE FROM cart_items WHERE cart_id = ?', [cart.id]);
      await db.execute("UPDATE carts SET updated_at = datetime('now') WHERE id = ?", [cart.id]);

      // Commit transaction
      await db.execute('COMMIT');
    } catch (txError) {
      await db.execute('ROLLBACK');
      console.error('Transaction rollback during order creation:', txError);
      throw txError;
    }

    // 8.5 Trigger Order Confirmation Notifications (Customer & Admin) after verified commit
    try {
      const committedOrder = await db.queryOne<DbOrder>(
        'SELECT * FROM orders WHERE id = ?',
        [orderId]
      );
      if (committedOrder) {
        const committedItems = await db.query<any>(
          'SELECT * FROM order_items WHERE order_id = ? ORDER BY created_at ASC',
          [committedOrder.id]
        );
        await triggerNewOrderNotifications(committedOrder, committedItems);
      }
    } catch (notifErr) {
      console.error('Non-blocking notification error after order commit:', notifErr);
    }

    // 9. Return clean, safe order confirmation data
    return NextResponse.json({
      success: true,
      order: {
        id: orderId,
        orderNumber,
        status: 'CONFIRMED',
        paymentMethod: 'COD',
        paymentStatus: 'PENDING',
        customerName: customerName.trim(),
        customerEmail: finalEmail,
        customerPhone: customerPhone.trim(),
        deliveryAddress: deliveryAddress.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
        landmark: landmark ? landmark.trim() : null,
        deliveryOption,
        siteVisitRequired,
        siteVisitDate: siteVisitDate || null,
        siteVisitTime: siteVisitTime || null,
        subtotal,
        discount,
        deliveryCharge,
        totalAmount,
        notes: notes ? notes.trim() : null,
        createdAt: new Date().toISOString(),
        items: validatedItems,
      },
    });
  } catch (error) {
    console.error('Error placing order:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while placing your order. Please try again.' },
      { status: 500 }
    );
  }
}

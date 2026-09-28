import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedCustomer } from '@/lib/auth/customer';
import { getDatabase } from '@/lib/db';
import { DbCart } from '@/lib/db/types';

export async function GET(req: NextRequest) {
  const customer = await getAuthenticatedCustomer(req);
  if (!customer) {
    return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
  }

  try {
    const db = getDatabase();

    // 1. Ensure user has a cart
    let cart = await db.queryOne<DbCart>(
      'SELECT * FROM carts WHERE user_id = ?',
      [customer.id]
    );

    if (!cart) {
      const cartId = `cart-${customer.id}`;
      await db.execute(
        "INSERT INTO carts (id, user_id, created_at, updated_at) VALUES (?, ?, datetime('now'), datetime('now'))",
        [cartId, customer.id]
      );
      cart = {
        id: cartId,
        user_id: customer.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }

    // 2. Fetch cart items with product and variant details
    const rows = await db.query<{
      id: string;
      cart_id: string;
      product_id: string;
      variant_id: string | null;
      quantity: number;
      unit_price_snapshot: number;
      customization_data: string | null;
      product_name: string;
      product_slug: string;
      product_base_price: number;
      product_active: number;
      variant_name: string | null;
      variant_sku: string | null;
      variant_image: string | null;
      main_image: string | null;
    }>(
      `SELECT
        ci.id,
        ci.cart_id,
        ci.product_id,
        ci.variant_id,
        ci.quantity,
        ci.unit_price_snapshot,
        ci.customization_data,
        p.name as product_name,
        p.slug as product_slug,
        p.base_price as product_base_price,
        p.active as product_active,
        pv.name as variant_name,
        pv.sku as variant_sku,
        pv.preview_image as variant_image,
        (SELECT image_url FROM product_images WHERE product_id = p.id AND active = 1 ORDER BY is_main DESC, display_order ASC LIMIT 1) as main_image
       FROM cart_items ci
       JOIN carts c ON ci.cart_id = c.id
       JOIN products p ON ci.product_id = p.id
       LEFT JOIN product_variants pv ON ci.variant_id = pv.id
       WHERE c.user_id = ?
       ORDER BY ci.created_at ASC`,
      [customer.id]
    );

    let total = 0;
    let count = 0;

    const items = rows.map((r) => {
      let customObj: Record<string, any> = {};
      if (r.customization_data) {
        try {
          customObj = JSON.parse(r.customization_data);
        } catch {
          customObj = {};
        }
      }

      const itemTotal = r.unit_price_snapshot * r.quantity;
      total += itemTotal;
      count += r.quantity;

      const img = r.variant_image || r.main_image || '/images/hero/living_room.jpg';

      return {
        id: r.id,
        productId: r.product_id,
        name: r.product_name,
        slug: r.product_slug,
        image: img,
        variantId: r.variant_id || undefined,
        variantName: r.variant_name || undefined,
        sku: r.variant_sku || r.product_slug,
        sizeLabel: customObj.sizeLabel || undefined,
        headingStyle: customObj.headingStyle || undefined,
        customDimensions: customObj.customDimensions || undefined,
        customizationData: customObj,
        quantity: r.quantity,
        unitPrice: r.unit_price_snapshot,
        totalPrice: itemTotal,
      };
    });

    return NextResponse.json({
      cartId: cart.id,
      items,
      count,
      total,
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const customer = await getAuthenticatedCustomer(req);
  if (!customer) {
    return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
  }

  try {
    const db = getDatabase();
    const cart = await db.queryOne<{ id: string }>('SELECT id FROM carts WHERE user_id = ?', [customer.id]);

    if (cart) {
      await db.execute('DELETE FROM cart_items WHERE cart_id = ?', [cart.id]);
      await db.execute("UPDATE carts SET updated_at = datetime('now') WHERE id = ?", [cart.id]);
    }

    return NextResponse.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    return NextResponse.json({ error: 'Failed to clear cart' }, { status: 500 });
  }
}

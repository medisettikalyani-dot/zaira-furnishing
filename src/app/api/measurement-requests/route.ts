import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getDatabase } from '@/lib/db';
import { verifyAdminRequest } from '@/lib/auth/admin';
import { getAuthenticatedCustomer } from '@/lib/auth/customer';
import { DbMeasurementRequest } from '@/lib/db/types';
import { generateMeasurementRequestNumber, resolveProductAndVariant } from '@/lib/db/requests';

// ─── POST /api/measurement-requests ───
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      productId,
      variantId,
      customerName,
      customerPhone,
      phone,
      customerEmail,
      email,
      address,
      preferredDate,
      preferredTimeSlot,
      dimensions,
      customerNotes,
      idempotencyKey,
    } = body;

    const resolvedPhone = customerPhone || phone;
    const resolvedEmail = customerEmail || email;

    // 1. Validate customer name
    if (!customerName || typeof customerName !== 'string' || customerName.trim().length === 0) {
      return NextResponse.json(
        { error: 'Customer name is required.' },
        { status: 400 }
      );
    }

    // 2. Validate customer phone (at least 10 digits)
    const cleanPhone = (resolvedPhone || '').replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      return NextResponse.json(
        { error: 'A valid phone number with at least 10 digits is required.' },
        { status: 400 }
      );
    }

    // 3. Validate address/location
    if (!address || typeof address !== 'string' || address.trim().length === 0) {
      return NextResponse.json(
        { error: 'Address or location is required for measurement visit.' },
        { status: 400 }
      );
    }

    // 4. Validate preferred date and time
    if (!preferredDate || typeof preferredDate !== 'string' || preferredDate.trim().length === 0) {
      return NextResponse.json(
        { error: 'Preferred date is required.' },
        { status: 400 }
      );
    }

    if (!preferredTimeSlot || typeof preferredTimeSlot !== 'string' || preferredTimeSlot.trim().length === 0) {
      return NextResponse.json(
        { error: 'Preferred time slot is required.' },
        { status: 400 }
      );
    }

    const db = getDatabase();

    // 5. Duplicate protection / Idempotency check
    if (idempotencyKey && typeof idempotencyKey === 'string' && idempotencyKey.trim().length > 0) {
      const existing = await db.queryOne<DbMeasurementRequest>(
        'SELECT * FROM measurement_requests WHERE idempotency_key = ?',
        [idempotencyKey.trim()]
      );
      if (existing) {
        return NextResponse.json(
          { success: true, measurementRequest: existing, duplicate: true },
          { status: 200 }
        );
      }
    }

    // 6. Server-side product & variant resolution
    let productCtx;
    try {
      productCtx = await resolveProductAndVariant(db, productId, variantId);
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }

    const { product, variant, categoryName, categorySlug } = productCtx;

    // 7. CRITICAL: Validate product supports custom measurement
    if (product.custom_measurement_available !== 1) {
      return NextResponse.json(
        { error: 'This product does not support in-home custom measurement requests.' },
        { status: 400 }
      );
    }

    // 8. Check for authenticated user session
    const authenticatedCustomer = await getAuthenticatedCustomer(req);
    const userId = authenticatedCustomer ? authenticatedCustomer.id : null;

    // 9. Generate unique request reference number and ID
    const id = `mr-${crypto.randomUUID()}`;
    const requestNumber = await generateMeasurementRequestNumber(db);

    // 10. Insert measurement request with genuine snapshots
    await db.execute(
      `INSERT INTO measurement_requests (
        id, request_number, user_id, customer_name, customer_phone, customer_email,
        product_id, product_name_snapshot, product_sku_snapshot,
        category_name_snapshot, category_slug_snapshot,
        variant_id, variant_name_snapshot,
        address, preferred_date, preferred_time_slot,
        dimensions, customer_notes, status, idempotency_key, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'NEW', ?, datetime('now'), datetime('now'))`,
      [
        id,
        requestNumber,
        userId,
        customerName.trim(),
        cleanPhone,
        resolvedEmail?.trim() || null,
        product.id,
        product.display_name || product.name,
        variant?.sku || product.id,
        categoryName,
        categorySlug,
        variant?.id || null,
        variant?.name || null,
        address.trim(),
        preferredDate.trim(),
        preferredTimeSlot.trim(),
        dimensions?.trim() || null,
        customerNotes?.trim() || null,
        idempotencyKey?.trim() || null,
      ]
    );

    const createdRecord = await db.queryOne<DbMeasurementRequest>(
      'SELECT * FROM measurement_requests WHERE id = ?',
      [id]
    );

    return NextResponse.json(
      { success: true, measurementRequest: createdRecord },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('Error creating measurement request:', err);
    return NextResponse.json(
      { error: 'An unexpected server error occurred while booking your measurement request.' },
      { status: 500 }
    );
  }
}

// ─── GET /api/measurement-requests ───
export async function GET(req: NextRequest) {
  try {
    const isAdmin = await verifyAdminRequest(req);
    const customer = await getAuthenticatedCustomer(req);

    if (!isAdmin && !customer) {
      return NextResponse.json(
        { error: 'Unauthorized: Authentication required' },
        { status: 401 }
      );
    }

    const db = getDatabase();
    const { searchParams } = new URL(req.url);

    // If Admin: list all requests with filters, search, and pagination
    if (isAdmin) {
      const search = searchParams.get('search')?.trim();
      const status = searchParams.get('status')?.trim();
      const pageParam = parseInt(searchParams.get('page') || '1', 10);
      const limitParam = parseInt(searchParams.get('limit') || '20', 10);

      const page = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
      const limit = isNaN(limitParam) || limitParam < 1 || limitParam > 100 ? 20 : limitParam;
      const offset = (page - 1) * limit;

      let whereClause = 'WHERE 1=1';
      const params: unknown[] = [];

      if (search) {
        whereClause += ` AND (
          request_number LIKE ? OR
          customer_name LIKE ? OR
          customer_phone LIKE ? OR
          customer_email LIKE ? OR
          address LIKE ? OR
          product_name_snapshot LIKE ?
        )`;
        const pattern = `%${search}%`;
        params.push(pattern, pattern, pattern, pattern, pattern, pattern);
      }

      if (status && status !== 'ALL') {
        whereClause += ' AND status = ?';
        params.push(status.toUpperCase());
      }

      const countSql = `SELECT COUNT(*) as total FROM measurement_requests ${whereClause}`;
      const countRow = await db.queryOne<{ total: number }>(countSql, params);
      const total = countRow?.total || 0;
      const totalPages = Math.ceil(total / limit) || 1;

      // Status count breakdowns for admin dashboard tabs
      const statusCounts = await db.query<{ status: string; cnt: number }>(
        'SELECT status, COUNT(*) as cnt FROM measurement_requests GROUP BY status'
      );
      const countsMap: Record<string, number> = {
        ALL: total,
        NEW: 0,
        CONTACTED: 0,
        SCHEDULED: 0,
        COMPLETED: 0,
        CANCELLED: 0,
      };
      for (const row of statusCounts) {
        countsMap[row.status] = row.cnt;
      }

      const querySql = `
        SELECT *
        FROM measurement_requests
        ${whereClause}
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `;
      const measurementRequests = await db.query<DbMeasurementRequest>(querySql, [...params, limit, offset]);

      return NextResponse.json({
        measurementRequests,
        total,
        page,
        totalPages,
        limit,
        counts: countsMap,
      });
    }

    // If Authenticated Customer: return only their own requests
    if (customer) {
      const measurementRequests = await db.query<DbMeasurementRequest>(
        'SELECT * FROM measurement_requests WHERE user_id = ? ORDER BY created_at DESC',
        [customer.id]
      );
      return NextResponse.json({ measurementRequests });
    }

    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  } catch (err: any) {
    console.error('Error fetching measurement requests:', err);
    return NextResponse.json({ error: 'Failed to fetch measurement requests.' }, { status: 500 });
  }
}

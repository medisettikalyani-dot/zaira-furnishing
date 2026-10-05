import crypto from 'crypto';
import { DatabaseClient } from './index';
import { DbProduct, DbProductVariant } from './types';

/**
 * Generates unique readable request reference for quote requests.
 * Format: ZQ-YYYYMMDD-XXXX (e.g. ZQ-20260928-E4A2)
 */
export async function generateQuoteRequestNumber(db: DatabaseClient): Promise<string> {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  while (true) {
    const randomSuffix = crypto.randomBytes(2).toString('hex').toUpperCase();
    const candidate = `ZQ-${dateStr}-${randomSuffix}`;
    const existing = await db.queryOne<{ id: string }>(
      'SELECT id FROM quote_requests WHERE request_number = ?',
      [candidate]
    );
    if (!existing) {
      return candidate;
    }
  }
}

/**
 * Generates unique readable request reference for measurement requests.
 * Format: ZM-YYYYMMDD-XXXX (e.g. ZM-20260928-8B1C)
 */
export async function generateMeasurementRequestNumber(db: DatabaseClient): Promise<string> {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  while (true) {
    const randomSuffix = crypto.randomBytes(2).toString('hex').toUpperCase();
    const candidate = `ZM-${dateStr}-${randomSuffix}`;
    const existing = await db.queryOne<{ id: string }>(
      'SELECT id FROM measurement_requests WHERE request_number = ?',
      [candidate]
    );
    if (!existing) {
      return candidate;
    }
  }
}

import { PRODUCTS, getProductBySlug } from '@/lib/data/products';

export interface ResolvedProductContext {
  product: DbProduct;
  variant: DbProductVariant | null;
  categoryName: string;
  categorySlug: string;
}

/**
 * Validates and resolves product, active variant, and category from the database.
 * Supports resolution by database ID, catalog ID, or canonical slug.
 */
export async function resolveProductAndVariant(
  db: DatabaseClient,
  productId: string,
  variantId?: string | null
): Promise<ResolvedProductContext> {
  const cleanId = (productId || '').trim();
  if (!cleanId) {
    throw new Error('A valid product identifier is required.');
  }

  // 1. Fetch product with category info by primary key ID OR slug
  let productRow = await db.queryOne<
    DbProduct & { category_name?: string | null; category_slug?: string | null }
  >(
    `SELECT p.*, c.name as category_name, c.slug as category_slug
     FROM products p
     LEFT JOIN categories c ON p.category_id = c.id
     WHERE p.id = ? OR p.slug = ?`,
    [cleanId, cleanId]
  );

  // 2. If not found in database directly, check static catalog products
  if (!productRow) {
    const staticProd = getProductBySlug(cleanId) || PRODUCTS.find((p) => p.id === cleanId || p.slug === cleanId);
    if (staticProd) {
      productRow = await db.queryOne<
        DbProduct & { category_name?: string | null; category_slug?: string | null }
      >(
        `SELECT p.*, c.name as category_name, c.slug as category_slug
         FROM products p
         LEFT JOIN categories c ON p.category_id = c.id
         WHERE p.id = ? OR p.slug = ?`,
        [staticProd.id, staticProd.slug]
      );
    }
  }

  // 3. Fallback to flagship custom made-to-measure product if needed
  if (!productRow) {
    productRow = await db.queryOne<
      DbProduct & { category_name?: string | null; category_slug?: string | null }
    >(
      `SELECT p.*, c.name as category_name, c.slug as category_slug
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = 'prod-off-custom-made-curtains' OR p.custom_measurement_available = 1
       ORDER BY p.display_order ASC
       LIMIT 1`
    );
  }

  if (!productRow) {
    throw new Error('Requested product does not exist.');
  }

  // 4. If variant ID supplied, fetch and validate
  let resolvedVariant: DbProductVariant | null = null;
  if (variantId && typeof variantId === 'string' && variantId.trim().length > 0) {
    const cleanVarId = variantId.trim();
    const variantRow = await db.queryOne<DbProductVariant>(
      'SELECT * FROM product_variants WHERE id = ? AND (product_id = ? OR product_id = ?)',
      [cleanVarId, cleanId, productRow.id]
    );

    if (variantRow && variantRow.active === 1) {
      resolvedVariant = variantRow;
    }
  }

  return {
    product: productRow,
    variant: resolvedVariant,
    categoryName: productRow.category_name || productRow.category_id,
    categorySlug: productRow.category_slug || productRow.category_id,
  };
}

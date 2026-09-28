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

export interface ResolvedProductContext {
  product: DbProduct;
  variant: DbProductVariant | null;
  categoryName: string;
  categorySlug: string;
}

/**
 * Validates and resolves product, active variant, and category from the database.
 * Throws an Error if product is missing/inactive or if variant is missing/inactive.
 */
export async function resolveProductAndVariant(
  db: DatabaseClient,
  productId: string,
  variantId?: string | null
): Promise<ResolvedProductContext> {
  if (!productId || typeof productId !== 'string') {
    throw new Error('A valid product ID is required.');
  }

  // 1. Fetch product with category info
  const productRow = await db.queryOne<
    DbProduct & { category_name?: string | null; category_slug?: string | null }
  >(
    `SELECT p.*, c.name as category_name, c.slug as category_slug
     FROM products p
     LEFT JOIN categories c ON p.category_id = c.id
     WHERE p.id = ?`,
    [productId.trim()]
  );

  if (!productRow) {
    throw new Error('Requested product does not exist.');
  }

  if (productRow.active !== 1) {
    throw new Error('Requested product is inactive or discontinued.');
  }

  // 2. If variant ID supplied, fetch and validate
  let resolvedVariant: DbProductVariant | null = null;
  if (variantId && typeof variantId === 'string' && variantId.trim().length > 0) {
    const variantRow = await db.queryOne<DbProductVariant>(
      'SELECT * FROM product_variants WHERE id = ? AND product_id = ?',
      [variantId.trim(), productId.trim()]
    );

    if (!variantRow) {
      throw new Error('Requested variant does not exist for this product.');
    }

    if (variantRow.active !== 1) {
      throw new Error('Requested variant is discontinued or inactive.');
    }

    resolvedVariant = variantRow;
  }

  return {
    product: productRow,
    variant: resolvedVariant,
    categoryName: productRow.category_name || productRow.category_id,
    categorySlug: productRow.category_slug || productRow.category_id,
  };
}

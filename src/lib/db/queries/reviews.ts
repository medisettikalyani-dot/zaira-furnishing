import crypto from 'crypto';
import { getDatabase } from '../index';
import { DbProductReview } from '../types';

export interface ProductReviewSummary {
  total: number;
  averageRating: string | null;
}

/**
 * Checks whether an authenticated user has genuinely purchased this product in any order.
 */
export async function checkUserPurchasedProduct(userId: string, productId: string): Promise<boolean> {
  if (!userId || !productId) return false;
  try {
    const db = getDatabase();
    const row = await db.queryOne<{ id: string }>(
      `SELECT oi.id
       FROM order_items oi
       JOIN orders o ON oi.order_id = o.id
       WHERE o.user_id = ? AND oi.product_id = ?
       LIMIT 1`,
      [userId, productId]
    );
    return Boolean(row);
  } catch (error) {
    console.error('Error checking user purchase:', error);
    return false;
  }
}

/**
 * Fetches all approved reviews for a specific product, ordered by creation date descending.
 */
export async function getDbProductReviews(productId: string): Promise<DbProductReview[]> {
  if (!productId) return [];
  try {
    const db = getDatabase();
    const rows = await db.query<DbProductReview>(
      `SELECT * FROM product_reviews
       WHERE product_id = ? AND status = 'APPROVED'
       ORDER BY created_at DESC`,
      [productId]
    );
    return rows || [];
  } catch (error) {
    console.error('Database query error in getDbProductReviews:', error);
    return [];
  }
}

/**
 * Calculates dynamic review count and average rating for a product from real database reviews.
 */
export async function getDbProductReviewSummary(productId: string): Promise<ProductReviewSummary> {
  const reviews = await getDbProductReviews(productId);
  if (!reviews || reviews.length === 0) {
    return { total: 0, averageRating: null };
  }
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  const avg = (sum / reviews.length).toFixed(1);
  return {
    total: reviews.length,
    averageRating: avg,
  };
}

/**
 * Creates and stores a customer review in the database.
 */
export async function createDbProductReview(data: {
  productId: string;
  userId?: string | null;
  customerName: string;
  rating: number;
  comment: string;
}): Promise<DbProductReview> {
  const db = getDatabase();
  const id = `rev_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;

  // Check genuine verified purchase if user is authenticated
  let isVerified = 0;
  if (data.userId) {
    const hasPurchased = await checkUserPurchasedProduct(data.userId, data.productId);
    isVerified = hasPurchased ? 1 : 0;
  }

  const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

  await db.execute(
    `INSERT INTO product_reviews (
      id, product_id, user_id, customer_name, rating, comment, is_verified_purchase, status, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 'APPROVED', ?, ?)`,
    [
      id,
      data.productId,
      data.userId || null,
      data.customerName.trim(),
      data.rating,
      data.comment.trim(),
      isVerified,
      now,
      now,
    ]
  );

  const created = await db.queryOne<DbProductReview>(
    'SELECT * FROM product_reviews WHERE id = ?',
    [id]
  );

  if (!created) {
    throw new Error('Failed to retrieve newly created review.');
  }

  return created;
}

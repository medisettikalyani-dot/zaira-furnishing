import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { getAuthenticatedCustomer } from '@/lib/auth/customer';
import {
  getDbProductReviews,
  getDbProductReviewSummary,
  createDbProductReview,
} from '@/lib/db/queries/reviews';
import { DbProduct } from '@/lib/db/types';

/**
 * GET /api/reviews?productId=... or ?slug=...
 * Fetches real database reviews belonging ONLY to the requested product.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    let productId = searchParams.get('productId');
    const slug = searchParams.get('slug');

    const db = getDatabase();

    // If only slug is passed, resolve productId
    if (!productId && slug) {
      const prod = await db.queryOne<DbProduct>(
        'SELECT id FROM products WHERE slug = ? AND active = 1',
        [slug]
      );
      if (prod) {
        productId = prod.id;
      }
    }

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID or slug is required.' },
        { status: 400 }
      );
    }

    const [reviews, summary] = await Promise.all([
      getDbProductReviews(productId),
      getDbProductReviewSummary(productId),
    ]);

    return NextResponse.json({
      data: reviews,
      total: summary.total,
      averageRating: summary.averageRating,
    });
  } catch (error) {
    console.error('API /api/reviews GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product reviews.' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/reviews
 * Submits a new review for a specific product.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, rating, comment, customerName } = body;
    let productId = body.productId;

    const db = getDatabase();

    // If only slug was provided, resolve productId
    if (!productId && slug) {
      const prod = await db.queryOne<DbProduct>(
        'SELECT id FROM products WHERE slug = ? AND active = 1',
        [slug]
      );
      if (prod) {
        productId = prod.id;
      }
    }

    if (!productId || typeof productId !== 'string') {
      return NextResponse.json(
        { error: 'A valid Product ID is required.' },
        { status: 400 }
      );
    }

    // Verify product exists in database
    const existingProduct = await db.queryOne<DbProduct>(
      'SELECT id, name FROM products WHERE id = ? AND active = 1',
      [productId]
    );

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'The specified product does not exist.' },
        { status: 404 }
      );
    }

    // Validate rating (1–5)
    const parsedRating = Number(rating);
    if (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return NextResponse.json(
        { error: 'Please select a star rating between 1 and 5.' },
        { status: 400 }
      );
    }

    // Validate review text
    if (!comment || typeof comment !== 'string' || comment.trim().length < 5) {
      return NextResponse.json(
        { error: 'Please enter a review of at least 5 characters.' },
        { status: 400 }
      );
    }

    if (comment.trim().length > 2000) {
      return NextResponse.json(
        { error: 'Review text cannot exceed 2000 characters.' },
        { status: 400 }
      );
    }

    // Check if customer is authenticated
    const customer = await getAuthenticatedCustomer(req);
    const userId = customer ? customer.id : null;

    // Resolve customer display name
    const resolvedName =
      customerName && typeof customerName === 'string' && customerName.trim().length > 0
        ? customerName.trim()
        : customer?.name || 'Verified Homeowner';

    // Create review in database
    const review = await createDbProductReview({
      productId,
      userId,
      customerName: resolvedName,
      rating: parsedRating,
      comment: comment.trim(),
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Review submitted successfully.',
        data: review,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('API /api/reviews POST error:', error);
    return NextResponse.json(
      { error: 'Failed to submit review. Please try again.' },
      { status: 500 }
    );
  }
}

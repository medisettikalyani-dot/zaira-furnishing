import { getDatabase } from './index';
import {
  DbCategory,
  DbSubcategory,
  DbProduct,
  DbProductImage,
  DbProductVariant,
  DbProductSpecification,
  DbService,
  DbCmsContent,
} from './types';
import { Product, ProductVariation, ProductSpecification, Category, Service } from '@/lib/data/types';
import { CATEGORIES, normalizeCategorySlug } from '@/lib/data/categories';

/**
 * Maps D1 category record to frontend Category model
 */
export function mapDbCategoryToFrontend(c: DbCategory): Category {
  return {
    id: c.id,
    slug: c.slug,
    name: c.name,
    tagline: c.tagline || '',
    description: c.description || '',
    image: c.image || '',
    featured: c.featured === 1,
    isCustomizable: c.is_customizable === 1,
    itemCountText: c.item_count_text || 'In Atelier',
  };
}

/**
 * Maps D1 service record to frontend Service model
 */
export function mapDbServiceToFrontend(s: DbService): Service {
  let parsedHighlights: string[] = [];
  if (s.highlights) {
    try {
      parsedHighlights = JSON.parse(s.highlights);
    } catch {
      parsedHighlights = [];
    }
  }

  return {
    id: s.id,
    slug: s.slug,
    title: s.name,
    shortDesc: s.short_desc,
    fullDesc: s.full_desc || '',
    iconName: s.icon_name,
    highlights: parsedHighlights,
    requiresSiteVisit: s.requires_site_visit === 1,
  };
}

/**
 * Maps D1 full product record to frontend Product model
 */
export function mapDbProductToFrontend(
  p: DbProduct & { category_slug?: string },
  images: DbProductImage[],
  variants: DbProductVariant[],
  specs: DbProductSpecification[],
  categoryName?: string
): Product {
  const sortedImages = [...images].sort((a, b) => a.display_order - b.display_order);
  const mainImg = sortedImages.find((img) => img.is_main === 1) || sortedImages[0];
  const gallery = sortedImages.map((img) => img.image_url);

  let parsedSpaces: string[] = [];
  if (p.space_slugs) {
    try {
      parsedSpaces = JSON.parse(p.space_slugs);
    } catch {
      parsedSpaces = [];
    }
  }

  const mappedVariants: ProductVariation[] = variants.map((v) => {
    let parsedAttrs: Record<string, string> = {};
    if (v.attributes) {
      try {
        parsedAttrs = JSON.parse(v.attributes);
      } catch {
        parsedAttrs = {};
      }
    }

    return {
      id: v.id,
      name: v.name,
      type: v.variant_type as any,
      colorHex: v.color_hex || undefined,
      thumbnailImage: v.thumbnail_image || undefined,
      image: v.preview_image || undefined,
      sku: v.sku,
      price: v.price_adjustment ? p.base_price + v.price_adjustment : p.base_price,
      inStock: v.in_stock === 1,
      attributes: parsedAttrs,
    };
  });

  const mappedSpecs: ProductSpecification[] = specs.map((s) => ({
    label: s.label,
    value: s.value,
  }));

  // Resolve subcategory types for legacy route compatibility
  const resolvedCategorySlug = p.category_slug || normalizeCategorySlug(p.category_id);
  const subcategory = p.subcategory_id || undefined;
  const isCurtain = resolvedCategorySlug === 'curtains-drapes';
  const isBlind = resolvedCategorySlug === 'window-blinds-shades';
  const isSofa = resolvedCategorySlug === 'sofa-fabrics-upholstery';
  const isWallpaper = resolvedCategorySlug === 'wallpapers-wall-coverings';
  const isCarpet = resolvedCategorySlug === 'carpets-rugs';

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    displayName: p.display_name || p.name,
    categorySlug: resolvedCategorySlug,
    categoryName: categoryName || p.category_id,
    shortDescription: p.short_description || '',
    description: p.description,
    productType: p.product_type,
    price: p.base_price,
    startingPrice: p.starting_price === 1,
    currency: p.currency || '₹',
    mainImage: mainImg?.image_url || '/images/hero/living_room.jpg',
    galleryImages: gallery.length > 0 ? gallery : [mainImg?.image_url || '/images/hero/living_room.jpg'],
    variations: mappedVariants,
    specifications: mappedSpecs,
    spaceSlugs: parsedSpaces,
    featured: p.featured === 1,
    customMeasurementAvailable: p.custom_measurement_available === 1,
    curtainType: isCurtain ? subcategory : undefined,
    blindType: isBlind ? subcategory : undefined,
    sofaFabricType: isSofa ? subcategory : undefined,
    wallpaperType: isWallpaper ? subcategory : undefined,
    carpetType: isCarpet ? subcategory : undefined,
  };
}

/**
 * Fetch all categories from Cloudflare D1
 */
export async function getDynamicCategories(): Promise<Category[]> {
  try {
    const db = getDatabase();
    const rows = await db.query<DbCategory>(
      'SELECT * FROM categories WHERE active = 1 ORDER BY display_order ASC'
    );
    return rows.map(mapDbCategoryToFrontend);
  } catch (err) {
    console.error('Error fetching categories from D1:', err);
    return [];
  }
}

/**
 * Fetch a single category by slug from Cloudflare D1
 */
export async function getDynamicCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const db = getDatabase();
    const row = await db.queryOne<DbCategory>(
      'SELECT * FROM categories WHERE slug = ? AND active = 1',
      [slug]
    );
    if (!row) return null;
    return mapDbCategoryToFrontend(row);
  } catch (err) {
    console.error(`Error fetching category ${slug} from D1:`, err);
    return null;
  }
}

/**
 * Fetch all subcategories from Cloudflare D1
 */
export async function getDynamicSubcategories(categoryId?: string): Promise<DbSubcategory[]> {
  try {
    const db = getDatabase();
    let sql = 'SELECT * FROM subcategories WHERE active = 1';
    const params: unknown[] = [];
    if (categoryId) {
      sql += ' AND category_id = ?';
      params.push(categoryId);
    }
    sql += ' ORDER BY display_order ASC';
    return await db.query<DbSubcategory>(sql, params);
  } catch (err) {
    console.error('Error fetching subcategories from D1:', err);
    return [];
  }
}

/**
 * Fetch all products from Cloudflare D1 with relational joins
 */
export async function getDynamicProducts(filters?: {
  categorySlug?: string;
  featured?: boolean;
  search?: string;
}): Promise<Product[]> {
  try {
    const db = getDatabase();
    let sql = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.active = 1
    `;
    const params: unknown[] = [];

    if (filters?.categorySlug) {
      sql += ' AND (p.category_id = ? OR c.slug = ?)';
      params.push(filters.categorySlug, filters.categorySlug);
    }

    if (filters?.featured !== undefined) {
      sql += ' AND p.featured = ?';
      params.push(filters.featured ? 1 : 0);
    }

    if (filters?.search) {
      sql += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    sql += ' ORDER BY p.display_order ASC';

    const products = await db.query<DbProduct & { category_name?: string }>(sql, params);
    if (!products || products.length === 0) return [];

    // Fetch images, variants, and specifications in batch
    const productIds = products.map((p) => p.id);
    const placeholders = productIds.map(() => '?').join(',');

    const [allImages, allVariants, allSpecs] = await Promise.all([
      db.query<DbProductImage>(
        `SELECT * FROM product_images WHERE product_id IN (${placeholders}) AND active = 1 ORDER BY display_order ASC`,
        productIds
      ),
      db.query<DbProductVariant>(
        `SELECT * FROM product_variants WHERE product_id IN (${placeholders}) AND active = 1 ORDER BY display_order ASC`,
        productIds
      ),
      db.query<DbProductSpecification>(
        `SELECT * FROM product_specifications WHERE product_id IN (${placeholders}) ORDER BY display_order ASC`,
        productIds
      ),
    ]);

    const imagesByProduct: Record<string, DbProductImage[]> = {};
    for (const img of allImages) {
      if (!imagesByProduct[img.product_id]) imagesByProduct[img.product_id] = [];
      imagesByProduct[img.product_id].push(img);
    }

    const variantsByProduct: Record<string, DbProductVariant[]> = {};
    for (const v of allVariants) {
      if (!variantsByProduct[v.product_id]) variantsByProduct[v.product_id] = [];
      variantsByProduct[v.product_id].push(v);
    }

    const specsByProduct: Record<string, DbProductSpecification[]> = {};
    for (const s of allSpecs) {
      if (!specsByProduct[s.product_id]) specsByProduct[s.product_id] = [];
      specsByProduct[s.product_id].push(s);
    }

    return products.map((p) =>
      mapDbProductToFrontend(
        p,
        imagesByProduct[p.id] || [],
        variantsByProduct[p.id] || [],
        specsByProduct[p.id] || [],
        p.category_name
      )
    );
  } catch (err) {
    console.error('Error fetching dynamic products from D1:', err);
    return [];
  }
}

/**
 * Fetch a single product by slug from Cloudflare D1
 */
export async function getDynamicProductBySlug(slug: string): Promise<Product | null> {
  try {
    const db = getDatabase();
    const product = await db.queryOne<DbProduct & { category_name?: string; category_slug?: string }>(
      `SELECT p.*, c.name as category_name, c.slug as category_slug
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.slug = ? AND p.active = 1`,
      [slug]
    );

    if (!product) return null;

    const [images, variants, specs] = await Promise.all([
      db.query<DbProductImage>(
        'SELECT * FROM product_images WHERE product_id = ? AND active = 1 ORDER BY display_order ASC',
        [product.id]
      ),
      db.query<DbProductVariant>(
        'SELECT * FROM product_variants WHERE product_id = ? AND active = 1 ORDER BY display_order ASC',
        [product.id]
      ),
      db.query<DbProductSpecification>(
        'SELECT * FROM product_specifications WHERE product_id = ? ORDER BY display_order ASC',
        [product.id]
      ),
    ]);

    return mapDbProductToFrontend(product, images, variants, specs, product.category_name);
  } catch (err) {
    console.error(`Error fetching dynamic product by slug ${slug} from D1:`, err);
    return null;
  }
}

/**
 * Fetch services from Cloudflare D1
 */
export async function getDynamicServices(): Promise<Service[]> {
  try {
    const db = getDatabase();
    const rows = await db.query<DbService>(
      'SELECT * FROM services WHERE active = 1 ORDER BY display_order ASC'
    );
    return rows.map(mapDbServiceToFrontend);
  } catch (err) {
    console.error('Error fetching services from D1:', err);
    return [];
  }
}

/**
 * Fetch single service by slug from Cloudflare D1
 */
export async function getDynamicServiceBySlug(slug: string): Promise<Service | null> {
  try {
    const db = getDatabase();
    const row = await db.queryOne<DbService>(
      'SELECT * FROM services WHERE slug = ? AND active = 1',
      [slug]
    );
    if (!row) return null;
    return mapDbServiceToFrontend(row);
  } catch (err) {
    console.error(`Error fetching service ${slug} from D1:`, err);
    return null;
  }
}

/**
 * Fetch CMS section from Cloudflare D1
 */
export async function getDynamicCmsSection(sectionKey: string): Promise<DbCmsContent | null> {
  try {
    const db = getDatabase();
    const row = await db.queryOne<DbCmsContent>(
      'SELECT * FROM cms_content WHERE section_key = ?',
      [sectionKey]
    );
    return row || null;
  } catch (err) {
    console.error(`Error fetching CMS section ${sectionKey} from D1:`, err);
    return null;
  }
}

/**
 * Fetch all CMS sections from Cloudflare D1
 */
export async function getDynamicAllCmsSections(): Promise<Record<string, DbCmsContent>> {
  try {
    const db = getDatabase();
    const rows = await db.query<DbCmsContent>('SELECT * FROM cms_content');
    const dict: Record<string, DbCmsContent> = {};
    for (const r of rows) {
      dict[r.section_key] = r;
    }
    return dict;
  } catch (err) {
    console.error('Error fetching all CMS sections from D1:', err);
    return {};
  }
}

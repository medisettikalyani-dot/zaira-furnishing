import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/auth/admin';
import { getDatabase } from '@/lib/db';
import {
  DbProduct,
  DbProductImage,
  DbProductVariant,
  DbProductSpecification,
  DbCustomizationConfig,
} from '@/lib/db/types';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const isAuthorized = await verifyAdminRequest(req);
  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const db = getDatabase();

    const product = await db.queryOne<DbProduct>(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const [images, variants, specifications, customization_configs] = await Promise.all([
      db.query<DbProductImage>(
        'SELECT * FROM product_images WHERE product_id = ? ORDER BY display_order ASC',
        [id]
      ),
      db.query<DbProductVariant>(
        'SELECT * FROM product_variants WHERE product_id = ? ORDER BY display_order ASC',
        [id]
      ),
      db.query<DbProductSpecification>(
        'SELECT * FROM product_specifications WHERE product_id = ? ORDER BY display_order ASC',
        [id]
      ),
      db.query<DbCustomizationConfig>(
        'SELECT * FROM customization_configs WHERE product_id = ? ORDER BY display_order ASC',
        [id]
      ),
    ]);

    return NextResponse.json({
      data: {
        ...product,
        images,
        variants,
        specifications,
        customization_configs,
      },
    });
  } catch (error) {
    console.error('Admin GET product by id error:', error);
    return NextResponse.json({ error: 'Failed to fetch product details' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const isAuthorized = await verifyAdminRequest(req);
  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();

    const {
      category_id,
      subcategory_id,
      name,
      display_name,
      slug,
      description,
      short_description,
      product_type,
      pricing_type,
      base_price,
      starting_price,
      unit,
      custom_made,
      featured,
      custom_measurement_available,
      active,
      display_order,
      currency,
      space_slugs,
      images,
      variants,
      specifications,
      customization_configs,
    } = body;

    const db = getDatabase();
    const existing = await db.queryOne<DbProduct>('SELECT * FROM products WHERE id = ?', [id]);
    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const cleanSlug = slug ? slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-') : existing.slug;
    const spaceSlugsJson = space_slugs ? JSON.stringify(space_slugs) : existing.space_slugs;

    // 1. Update Core Product Table
    await db.execute(
      `UPDATE products SET
        category_id = ?,
        subcategory_id = ?,
        name = ?,
        display_name = ?,
        slug = ?,
        description = ?,
        short_description = ?,
        product_type = ?,
        pricing_type = ?,
        base_price = ?,
        starting_price = ?,
        unit = ?,
        custom_made = ?,
        featured = ?,
        custom_measurement_available = ?,
        active = ?,
        display_order = ?,
        currency = ?,
        space_slugs = ?,
        updated_at = datetime('now')
      WHERE id = ?`,
      [
        category_id !== undefined ? category_id : existing.category_id,
        subcategory_id !== undefined ? subcategory_id : existing.subcategory_id,
        name !== undefined ? name.trim() : existing.name,
        display_name !== undefined ? display_name.trim() : existing.display_name,
        cleanSlug,
        description !== undefined ? description.trim() : existing.description,
        short_description !== undefined ? short_description.trim() : existing.short_description,
        product_type !== undefined ? product_type : existing.product_type,
        pricing_type !== undefined ? pricing_type : existing.pricing_type,
        base_price !== undefined ? Number(base_price) : existing.base_price,
        starting_price !== undefined ? (starting_price ? 1 : 0) : existing.starting_price,
        unit !== undefined ? unit.trim() : existing.unit,
        custom_made !== undefined ? (custom_made ? 1 : 0) : existing.custom_made,
        featured !== undefined ? (featured ? 1 : 0) : existing.featured,
        custom_measurement_available !== undefined
          ? custom_measurement_available
            ? 1
            : 0
          : existing.custom_measurement_available,
        active !== undefined ? (active ? 1 : 0) : existing.active,
        display_order !== undefined ? Number(display_order) : existing.display_order,
        currency !== undefined ? currency : existing.currency,
        spaceSlugsJson,
        id,
      ]
    );

    // 2. Sync Images if provided
    if (Array.isArray(images)) {
      await db.execute('DELETE FROM product_images WHERE product_id = ?', [id]);
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        const imgId = img.id || `img-${id}-${i}-${Date.now().toString().slice(-4)}`;
        await db.execute(
          `INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_main, active)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            imgId,
            id,
            img.image_url,
            img.alt_text || name || existing.name,
            i,
            img.is_main ? 1 : 0,
            img.active !== undefined ? (img.active ? 1 : 0) : 1,
          ]
        );
      }
    }

    // 3. Sync Variants if provided
    if (Array.isArray(variants)) {
      await db.execute('DELETE FROM product_variants WHERE product_id = ?', [id]);
      for (let j = 0; j < variants.length; j++) {
        const v = variants[j];
        const vId = v.id || `var-${id}-${j}-${Date.now().toString().slice(-4)}`;
        const attrJson = typeof v.attributes === 'string' ? v.attributes : JSON.stringify(v.attributes || {});
        await db.execute(
          `INSERT INTO product_variants (id, product_id, name, variant_type, sku, color_hex, thumbnail_image, preview_image, price_adjustment, in_stock, attributes, display_order, active)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            vId,
            id,
            v.name || 'Default Variant',
            v.variant_type || 'color',
            v.sku || `${cleanSlug}-${j}`,
            v.color_hex || null,
            v.thumbnail_image || null,
            v.preview_image || null,
            Number(v.price_adjustment) || 0,
            v.in_stock ? 1 : 0,
            attrJson,
            j,
            v.active !== undefined ? (v.active ? 1 : 0) : 1,
          ]
        );
      }
    }

    // 4. Sync Specifications if provided
    if (Array.isArray(specifications)) {
      await db.execute('DELETE FROM product_specifications WHERE product_id = ?', [id]);
      for (let k = 0; k < specifications.length; k++) {
        const s = specifications[k];
        const sId = s.id || `spec-${id}-${k}-${Date.now().toString().slice(-4)}`;
        await db.execute(
          `INSERT INTO product_specifications (id, product_id, label, value, display_order)
           VALUES (?, ?, ?, ?, ?)`,
          [sId, id, s.label?.trim() || '', s.value?.trim() || '', k]
        );
      }
    }

    // 5. Sync Customization Configs if provided
    if (Array.isArray(customization_configs)) {
      await db.execute('DELETE FROM customization_configs WHERE product_id = ?', [id]);
      for (let c = 0; c < customization_configs.length; c++) {
        const cfg = customization_configs[c];
        const cfgId = cfg.id || `cfg-${id}-${c}-${Date.now().toString().slice(-4)}`;
        const optionsJson = typeof cfg.options === 'string' ? cfg.options : JSON.stringify(cfg.options || []);
        await db.execute(
          `INSERT INTO customization_configs (id, product_id, field_key, field_label, field_type, options, default_value, min_value, max_value, unit, is_required, display_order)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            cfgId,
            id,
            cfg.field_key,
            cfg.field_label,
            cfg.field_type || 'select',
            optionsJson,
            cfg.default_value || null,
            cfg.min_value !== undefined ? Number(cfg.min_value) : null,
            cfg.max_value !== undefined ? Number(cfg.max_value) : null,
            cfg.unit || null,
            cfg.is_required ? 1 : 0,
            c,
          ]
        );
      }
    }

    return NextResponse.json({ success: true, id, slug: cleanSlug });
  } catch (error) {
    console.error('Admin PUT product error:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const isAuthorized = await verifyAdminRequest(req);
  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const db = getDatabase();

    // Soft-deactivate product
    await db.execute("UPDATE products SET active = 0, updated_at = datetime('now') WHERE id = ?", [id]);

    return NextResponse.json({ success: true, deactivated: true });
  } catch (error) {
    console.error('Admin DELETE product error:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}

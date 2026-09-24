import { Category } from './types';

/**
 * Official Zaira Furnishing Product Categories (All 14 catalog sections)
 * Slugs match the official 14 categories exactly.
 */
export const CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    slug: 'curtains-drapes',
    name: 'Curtains & Drapes',
    tagline: 'Bespoke tailoring, sheer elegance & acoustic drapery',
    description: 'Find curtains and drapes for different rooms and window styles.',
    image: '/images/hero/curtains.jpg',
    featured: true,
    isCustomizable: true,
    itemCountText: 'Curtains & Drapery',
  },
  {
    id: 'cat-2',
    slug: 'window-blinds-shades',
    name: 'Window Blinds & Shades',
    tagline: 'Precision motorized & manual light control systems',
    description: 'Architectural roller blinds, wooden venetians, cellular shades, and automated motorized systems.',
    image: '/images/hero/blinds.jpg',
    featured: true,
    isCustomizable: true,
    itemCountText: 'Blinds & Shades',
  },
  {
    id: 'cat-3',
    slug: 'sofa-fabrics-upholstery',
    name: 'Sofa Fabrics & Upholstery',
    tagline: 'High-durability velvets, performance linens & Italian bouclés',
    description: 'Premium upholstery textiles, stain-resistant performance fabrics, textured weaves, and tailored solutions.',
    image: '/images/hero/sofa_fabrics.jpg',
    featured: true,
    isCustomizable: true,
    itemCountText: 'Fabrics & Upholstery',
  },
  {
    id: 'cat-4',
    slug: 'wallpapers-wall-coverings',
    name: 'Wallpapers & Wall Coverings',
    tagline: 'Textured grasscloth, metallic leaf & custom panoramic murals',
    description: 'Luxury embossed wallcoverings, natural silk and grasscloth panels, and bespoke textured murals.',
    image: '/images/hero/wallpapers.jpg',
    featured: true,
    isCustomizable: true,
    itemCountText: 'Wallpapers & Murals',
  },
  {
    id: 'cat-5',
    slug: 'mattresses-sleep-systems',
    name: 'Mattresses & Sleep Systems',
    tagline: 'Orthopedic comfort, natural latex & zero-motion pocket springs',
    description: 'Engineered ergonomic mattresses, contouring natural latex, hybrid pocket springs, and custom bases.',
    image: '/images/hero/bedroom.jpg',
    featured: true,
    isCustomizable: true,
    itemCountText: 'Mattresses & Bases',
  },
  {
    id: 'cat-6',
    slug: 'carpets-rugs',
    name: 'Carpets & Rugs',
    tagline: 'Hand-tufted wool, silk blends & seamless wall-to-wall carpets',
    description: 'Artisanal hand-knotted area rugs, subtle textured wools, and acoustic carpets for living spaces.',
    image: '/images/hero/rugs.jpg',
    featured: true,
    isCustomizable: true,
    itemCountText: 'Carpets & Rugs',
  },
  {
    id: 'cat-7',
    slug: 'wooden-flooring-sports-floor',
    name: 'Wooden Flooring & Sports Floor',
    tagline: 'Engineered European oak, herringbone & athletic performance surfaces',
    description: 'Authentic engineered hardwood planks, herringbone parquet, and high-performance athletic flooring.',
    image: '/images/hero/flooring.jpg',
    featured: true,
    isCustomizable: true,
    itemCountText: 'Flooring & Parquet',
  },
  {
    id: 'cat-8',
    slug: 'artificial-turf-green-walls',
    name: 'Artificial Turf & Green Walls',
    tagline: 'UV-stabilized lush landscape grass & botanical vertical panels',
    description: 'High-density landscape turf for balconies and terraces, and maintenance-free biophilic foliage walls.',
    image: '/images/categories/artificial-turf.jpg',
    featured: true,
    isCustomizable: true,
    itemCountText: 'Turf & Green Walls',
  },
  {
    id: 'cat-9',
    slug: 'bed-linen-bath',
    name: 'Bed Linen & Bath',
    tagline: 'Egyptian cotton 800TC sateen & plush combed towels',
    description: 'Silky smooth duvet sets, breathable percale sheets, and spa-grade Turkish cotton bath linens.',
    image: '/images/categories/bed-linen.jpg',
    featured: true,
    isCustomizable: false,
    itemCountText: 'Linen & Bath',
  },
  {
    id: 'cat-10',
    slug: 'cushions-pillows',
    name: 'Cushions & Pillows',
    tagline: 'Embroidered accents, microfibre inserts & tactile textures',
    description: 'Curated decorative cushion covers, hand-embroidered bolster pillows, and tactile textured accents.',
    image: '/images/categories/cushions.jpg',
    featured: true,
    isCustomizable: false,
    itemCountText: 'Cushions & Pillows',
  },
  {
    id: 'cat-11',
    slug: 'table-linen-dining-decor',
    name: 'Table Linen & Dining Decor',
    tagline: 'Pure Belgian linen runners, placemats & napkin rings',
    description: 'Tailored dining table runners, organic linen napkins, braided placemats, and tabletop accents.',
    image: '/images/categories/table-linen.jpg',
    featured: true,
    isCustomizable: false,
    itemCountText: 'Table Linen & Decor',
  },
  {
    id: 'cat-12',
    slug: 'crockery-glassware',
    name: 'Crockery & Glassware',
    tagline: 'Hand-glazed stoneware, fine porcelain & lead-free crystal',
    description: 'Minimalist dinnerware sets, matte ceramic serving bowls, crystal goblets, and artisan glassware.',
    image: '/images/categories/crockery.jpg',
    featured: true,
    isCustomizable: false,
    itemCountText: 'Crockery & Glassware',
  },
  {
    id: 'cat-13',
    slug: 'artefacts-home-decor',
    name: 'Artefacts & Home Decor',
    tagline: 'Sculptural stone vessels, bronze accents & curated ceramics',
    description: 'Curated architectural sculptures, fluted ceramic urns, and organic travertine statement pieces.',
    image: '/images/categories/artefacts.jpg',
    featured: true,
    isCustomizable: false,
    itemCountText: 'Artefacts & Decor',
  },
  {
    id: 'cat-14',
    slug: 'decorative-wall-clocks',
    name: 'Decorative Wall Clocks',
    tagline: 'Silent Japanese sweep movements, marble dials & minimalist frames',
    description: 'Modern statement wall clocks featuring natural marble dials, champagne metallic rings, and walnut details.',
    image: '/images/categories/wall-clocks.jpg',
    featured: true,
    isCustomizable: false,
    itemCountText: 'Wall Clocks',
  },
];

/**
 * Normalizes any category slug (including legacy '-and-' variants) to the canonical slug.
 */
export function normalizeCategorySlug(rawSlug: string): string {
  if (!rawSlug) return '';
  const trimmed = rawSlug.trim().toLowerCase();

  const slugMap: Record<string, string> = {
    'curtains': 'curtains-drapes',
    'drapes': 'curtains-drapes',
    'curtains-and-drapes': 'curtains-drapes',
    'curtains-drapes': 'curtains-drapes',
    'window-blinds-and-shades': 'window-blinds-shades',
    'window-blinds-shades': 'window-blinds-shades',
    'sofa-fabrics-and-upholstery': 'sofa-fabrics-upholstery',
    'sofa-fabrics-upholstery': 'sofa-fabrics-upholstery',
    'wallpapers-and-wall-coverings': 'wallpapers-wall-coverings',
    'wallpapers-wall-coverings': 'wallpapers-wall-coverings',
    'mattresses-and-sleep-systems': 'mattresses-sleep-systems',
    'mattresses-sleep-systems': 'mattresses-sleep-systems',
    'carpets-and-rugs': 'carpets-rugs',
    'carpets-rugs': 'carpets-rugs',
    'wooden-flooring-and-sports-floor': 'wooden-flooring-sports-floor',
    'wooden-flooring-sports-floor': 'wooden-flooring-sports-floor',
    'artificial-turf-and-green-walls': 'artificial-turf-green-walls',
    'artificial-turf-green-walls': 'artificial-turf-green-walls',
    'bed-linen-and-bath': 'bed-linen-bath',
    'bed-linen-bath': 'bed-linen-bath',
    'cushions-and-pillows': 'cushions-pillows',
    'cushions-pillows': 'cushions-pillows',
    'table-linen-and-dining-decor': 'table-linen-dining-decor',
    'table-linen-dining-decor': 'table-linen-dining-decor',
    'crockery-and-glassware': 'crockery-glassware',
    'crockery-glassware': 'crockery-glassware',
    'artefacts-and-home-decor': 'artefacts-home-decor',
    'artefacts-home-decor': 'artefacts-home-decor',
    'decorative-wall-clocks': 'decorative-wall-clocks',
  };

  if (slugMap[trimmed]) {
    return slugMap[trimmed];
  }

  return trimmed.replace(/-and-/g, '-');
}

export function getFeaturedCategories(): Category[] {
  return CATEGORIES.filter((c) => c.featured);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  if (!slug) return undefined;
  const normalized = normalizeCategorySlug(slug);
  return CATEGORIES.find((c) => c.slug === normalized || c.slug === slug);
}


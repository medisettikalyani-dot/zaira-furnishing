import { Space } from './types';

export const SPACES: Space[] = [
  {
    id: 'space-1',
    slug: 'living-room',
    name: 'Living Room',
    tagline: 'Sofas, curtains, cushions and rugs for your living room',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'space-2',
    slug: 'bedroom',
    name: 'Bedroom',
    tagline: 'Curtains, bed linen and mattresses for your bedroom',
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'space-3',
    slug: 'dining',
    name: 'Dining Room',
    tagline: 'Table linen, dining decor and dinnerware',
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'space-4',
    slug: 'windows',
    name: 'Windows',
    tagline: 'Curtains, roller blinds and motorized shades',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'space-5',
    slug: 'outdoor',
    name: 'Outdoor',
    tagline: 'Artificial grass, green walls and outdoor cushions',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'space-6',
    slug: 'office-and-commercial',
    name: 'Office',
    tagline: 'Blinds, carpet tiles and furnishings for workspaces',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
  },
];

export function getSpaceBySlug(slug: string): Space | undefined {
  return SPACES.find((s) => s.slug === slug);
}

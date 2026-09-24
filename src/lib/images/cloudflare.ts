/**
 * Cloudflare R2 & Media Delivery Architecture
 *
 * Designed specifically for Zaira Furnishing:
 * In production, media assets are served from Cloudflare R2 storage bucket
 * (or Cloudflare Images / Custom CDN Domain) via NEXT_PUBLIC_CLOUDFLARE_R2_URL.
 *
 * During development, fallback demo URLs (high-resolution furnishing photography)
 * are served seamlessly so components are never tied to local static files.
 */

export interface CloudflareImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'avif';
  fit?: 'cover' | 'contain' | 'crop' | 'scale-down';
}

const CLOUDFLARE_R2_BASE_URL = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_URL || '';

/**
 * Resolves an image key or URL to a Cloudflare R2 URL or dev fallback URL.
 *
 * @param pathOrUrl - A key like 'products/curtains/belgian-linen-01.webp' or a full URL
 * @param options - Optional Cloudflare transformation parameters
 */
export function getMediaUrl(pathOrUrl: string, options?: CloudflareImageOptions): string {
  if (!pathOrUrl) return '';

  // If it's already an absolute URL (e.g. fallback during development)
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl;
  }

  // If Cloudflare R2 base URL is configured
  if (CLOUDFLARE_R2_BASE_URL) {
    const cleanBase = CLOUDFLARE_R2_BASE_URL.replace(/\/+$/, '');
    const cleanPath = pathOrUrl.replace(/^\/+/, '');

    // If using Cloudflare Images / zone transformations (e.g. /cdn-cgi/image/...)
    if (options && (options.width || options.quality || options.format)) {
      const transformParams = [
        options.width ? `width=${options.width}` : '',
        options.height ? `height=${options.height}` : '',
        options.quality ? `quality=${options.quality}` : 'quality=85',
        options.format ? `format=${options.format}` : 'format=auto',
        options.fit ? `fit=${options.fit}` : 'fit=cover',
      ].filter(Boolean).join(',');

      return `${cleanBase}/cdn-cgi/image/${transformParams}/${cleanPath}`;
    }

    return `${cleanBase}/${cleanPath}`;
  }

  // Fallback if no R2 base is defined and path is relative
  return pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
}

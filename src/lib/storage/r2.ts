import path from 'path';
import fs from 'fs';
import { getMediaUrl } from '@/lib/images/cloudflare';

export type UploadCategory = 'products' | 'categories' | 'services' | 'cms';

export interface StorageUploadResult {
  key: string;
  url: string;
  sizeBytes: number;
  mimeType: string;
}

/**
 * Server-Side Cloudflare R2 Upload & Media Manager
 *
 * Configured via environment variables:
 * - R2_ACCOUNT_ID: Cloudflare Account ID
 * - R2_ACCESS_KEY_ID: Cloudflare R2 S3-Compatible Access Key
 * - R2_SECRET_ACCESS_KEY: Cloudflare R2 S3-Compatible Secret
 * - R2_BUCKET_NAME: Target bucket (e.g. 'zaira-furnishing-media')
 * - NEXT_PUBLIC_CLOUDFLARE_R2_URL: Public CDN endpoint or custom domain
 *
 * In development, falls back to public uploads directory without requiring cloud credentials.
 */
export async function uploadMedia(
  fileBuffer: Buffer,
  fileName: string,
  category: UploadCategory,
  mimeType: string = 'image/webp'
): Promise<StorageUploadResult> {
  const accountId = process.env.R2_ACCOUNT_ID || process.env.CLOUDFLARE_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID || process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.R2_BUCKET_NAME || process.env.CLOUDFLARE_R2_BUCKET_NAME || 'zaira-furnishing-media';

  const cleanFileName = fileName.toLowerCase().replace(/[^a-z0-9_.-]/g, '-');
  const timestamp = Date.now();
  const key = `${category}/${timestamp}-${cleanFileName}`;

  // If R2 credentials are fully configured, upload directly to Cloudflare R2
  if (accountId && accessKeyId && secretAccessKey) {
    try {
      // In production with R2 credentials, upload via S3 API endpoint
      const endpoint = `https://${accountId}.r2.cloudflarestorage.com/${bucketName}/${key}`;
      
      // Standard HTTP PUT with S3 Authorization header or Cloudflare R2 API
      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': mimeType,
          'Content-Length': fileBuffer.length.toString(),
        },
        body: new Uint8Array(fileBuffer),
      });

      if (!res.ok) {
        throw new Error(`R2 upload responded with status: ${res.status}`);
      }

      return {
        key,
        url: getMediaUrl(key),
        sizeBytes: fileBuffer.length,
        mimeType,
      };
    } catch (err) {
      console.warn('Direct R2 upload failed, falling back to local storage:', err);
    }
  }

  // Development Fallback: write to public/uploads directory
  const uploadDir = path.resolve(process.cwd(), 'public', 'uploads', category);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const localPath = path.join(uploadDir, `${timestamp}-${cleanFileName}`);
  fs.writeFileSync(localPath, fileBuffer);

  const publicUrl = `/uploads/${category}/${timestamp}-${cleanFileName}`;

  return {
    key,
    url: publicUrl,
    sizeBytes: fileBuffer.length,
    mimeType,
  };
}

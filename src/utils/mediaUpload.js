// Secure Media Upload & Client-Side Image Compression Utility
// Eliminates browser LocalStorage quota overflow crashes by compressing images to ~60-90KB
// Supports direct upload to Supabase Storage bucket 'worker-site-photos' with safe fallback

import { getSupabase } from './supabaseClient';

/**
 * Compresses an image file in-browser using HTML5 Canvas
 * @param {File} file 
 * @param {number} maxWidth 
 * @param {number} quality 
 * @returns {Promise<{ blob: Blob, dataUrl: string }>}
 */
export function compressImage(file, maxWidth = 1024, quality = 0.72) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      return reject(new Error('Selected file is not an image.'));
    }

    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxWidth) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas 2D context unavailable'));

        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        canvas.toBlob((blob) => {
          if (!blob) return reject(new Error('Image blob conversion failed'));
          resolve({ blob, dataUrl });
        }, 'image/jpeg', quality);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads an image to Supabase Storage if configured; returns public URL or compact compressed DataURL fallback
 * @param {File} file
 * @param {string} folder
 * @returns {Promise<string>}
 */
export async function uploadSitePhoto(file, folder = 'worker-logs') {
  if (!file) return '';

  // 1. Compress image in browser first
  const { blob, dataUrl } = await compressImage(file, 1024, 0.72);

  const client = getSupabase();
  if (client) {
    try {
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const filePath = `${folder}/${Date.now()}_${cleanFileName}`;

      const { data, error } = await client.storage
        .from('worker-site-photos')
        .upload(filePath, blob, {
          contentType: 'image/jpeg',
          cacheControl: '3600',
          upsert: true
        });

      if (!error && data) {
        const { data: publicUrlData } = client.storage
          .from('worker-site-photos')
          .getPublicUrl(filePath);

        if (publicUrlData?.publicUrl) {
          return publicUrlData.publicUrl;
        }
      }
    } catch (err) {
      console.warn('Supabase storage upload skipped or failed, falling back to compressed local preview:', err);
    }
  }

  // Safe fallback: compressed dataUrl (<80KB)
  return dataUrl;
}

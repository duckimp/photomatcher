/**
 * In-memory registry of active object URLs for clean revocation and zero memory leaks.
 */
const activeObjectUrls = new Set();

export function createManagedObjectURL(blob) {
  if (!blob) return null;
  const url = URL.createObjectURL(blob);
  activeObjectUrls.add(url);
  return url;
}

export function revokeManagedObjectURL(url) {
  if (url && activeObjectUrls.has(url)) {
    URL.revokeObjectURL(url);
    activeObjectUrls.delete(url);
  }
}

export function revokeAllManagedObjectURLs() {
  activeObjectUrls.forEach(url => {
    try {
      URL.revokeObjectURL(url);
    } catch (e) {
      // Ignore
    }
  });
  activeObjectUrls.clear();
}

/**
 * Creates a lightweight 150px canvas thumbnail from an image File/Blob.
 * Returns { thumbnailBlob, thumbnailUrl, width, height }
 */
export async function createThumbnail(file, maxDimension = 160) {
  return new Promise((resolve) => {
    const tempUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      // Calculate scaled dimensions while maintaining aspect ratio
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxDimension) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        }
      } else {
        if (height > maxDimension) {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      // High quality smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'medium';
      ctx.drawImage(img, 0, 0, width, height);

      // Free temp object URL
      URL.revokeObjectURL(tempUrl);

      canvas.toBlob((blob) => {
        if (blob) {
          const thumbnailUrl = createManagedObjectURL(blob);
          resolve({
            thumbnailBlob: blob,
            thumbnailUrl,
            originalWidth: img.width,
            originalHeight: img.height,
          });
        } else {
          // Fallback to original url if canvas export fails
          const fallbackUrl = createManagedObjectURL(file);
          resolve({
            thumbnailBlob: file,
            thumbnailUrl: fallbackUrl,
            originalWidth: img.width,
            originalHeight: img.height,
          });
        }
      }, 'image/jpeg', 0.82);
    };

    img.onerror = () => {
      URL.revokeObjectURL(tempUrl);
      const fallbackUrl = createManagedObjectURL(file);
      resolve({
        thumbnailBlob: file,
        thumbnailUrl: fallbackUrl,
        originalWidth: 100,
        originalHeight: 100,
      });
    };

    img.src = tempUrl;
  });
}

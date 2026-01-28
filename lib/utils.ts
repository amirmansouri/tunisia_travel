import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const startFormatted = start.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  const endFormatted = end.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return `${startFormatted} - ${endFormatted}`;
}

export function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined) {
    return 'Prix à confirmer';
  }
  return new Intl.NumberFormat('en-TN', {
    style: 'currency',
    currency: 'TND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function calculateDuration(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1; // Include both start and end day
}

export function getDurationText(startDate: string, endDate: string): string {
  const days = calculateDuration(startDate, endDate);
  if (days === 1) return '1 Day';
  return `${days} Days`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '...';
}

/**
 * Extracts Google Drive file ID from various URL formats
 */
export function extractGoogleDriveId(url: string): string | null {
  if (!url) return null;

  // Google Drive file/d/ format
  const fileMatch = url.match(/drive\.google\.com\/file\/d\/([^/?]+)/);
  if (fileMatch) return fileMatch[1];

  // Google Drive open?id= format
  const openMatch = url.match(/drive\.google\.com\/open\?id=([^&]+)/);
  if (openMatch) return openMatch[1];

  // Google Drive uc?id= format
  const ucMatch = url.match(/drive\.google\.com\/uc\?.*id=([^&]+)/);
  if (ucMatch) return ucMatch[1];

  // Google Drive thumbnail format
  const thumbMatch = url.match(/drive\.google\.com\/thumbnail\?.*id=([^&]+)/);
  if (thumbMatch) return thumbMatch[1];

  // Check if it's just a file ID
  if (/^[a-zA-Z0-9_-]{25,50}$/.test(url)) {
    return url;
  }

  return null;
}

/**
 * Converts any image URL to a direct URL.
 * Handles Google Drive URLs in various formats:
 * - https://drive.google.com/file/d/FILE_ID/view
 * - https://drive.google.com/open?id=FILE_ID
 * - https://drive.google.com/uc?id=FILE_ID
 * - Just the FILE_ID (if it looks like a Google Drive ID)
 *
 * Uses the thumbnail endpoint which is more reliable for displaying images.
 * Returns the original URL for non-Google Drive images.
 */
export function getImageUrl(url: string): string {
  if (!url) return '';

  const fileId = extractGoogleDriveId(url);
  if (fileId) {
    // Use thumbnail format - works on desktop, may have issues on some mobile browsers
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w2000`;
  }

  // Return original URL for other image sources
  return url;
}

/**
 * Check if a URL is from Google Drive
 */
export function isGoogleDriveUrl(url: string): boolean {
  return extractGoogleDriveId(url) !== null;
}

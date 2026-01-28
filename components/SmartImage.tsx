'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { getImageUrl, isGoogleDriveUrl } from '@/lib/utils';
import { ImageIcon } from 'lucide-react';

interface SmartImageProps extends Omit<ImageProps, 'src'> {
  src: string;
}

/**
 * SmartImage - Automatically handles Google Drive images
 *
 * Usage:
 * - Pass any image URL or Google Drive file ID
 * - Automatically converts Google Drive URLs to direct image URLs
 * - Uses regular img tag for Google Drive images (more reliable)
 * - Uses Next.js Image for other images (optimization)
 */
export default function SmartImage({ src, alt, className, fill, style, ...props }: SmartImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const imageUrl = getImageUrl(src);
  const isGoogleDrive = isGoogleDriveUrl(src);

  // Show placeholder if error or no src
  if (hasError || !src) {
    const placeholderStyle: React.CSSProperties = fill
      ? {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f3f4f6',
        }
      : {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f3f4f6',
          ...(style || {}),
        };

    return (
      <div style={placeholderStyle} className={className}>
        <ImageIcon className="w-6 h-6 text-gray-400" />
      </div>
    );
  }

  // For Google Drive images, use regular img tag (more reliable)
  if (isGoogleDrive) {
    const imgStyle: React.CSSProperties = fill
      ? {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          ...(style || {}),
        }
      : (style || {});

    return (
      <>
        {isLoading && fill && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: '#f3f4f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
          </div>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={alt}
          className={className}
          style={imgStyle}
          loading="lazy"
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
        />
      </>
    );
  }

  // For other images, use Next.js Image for optimization
  return (
    <Image
      src={imageUrl}
      alt={alt}
      className={className}
      fill={fill}
      style={style}
      onError={() => setHasError(true)}
      {...props}
    />
  );
}

'use client';

import { useState } from 'react';

type ImagePreviewProps = {
    src:string | null,
    alt:string,
    className:string
}


export const ImageWithZoom = ({ src, alt, className } :ImagePreviewProps) => {
  const [isZoomed, setIsZoomed] = useState(false);

  if (!src) {
    return (
      <div className={`bg-muted rounded-lg flex items-center justify-center p-4 ${className || 'w-16 h-16'}`}>
        No image
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Thumbnail image that triggers zoom */}
      <img
        src={src}
        alt={alt}
        className={`cursor-pointer transition-transform duration-200 hover:scale-105 rounded-lg ${className || 'w-16 h-16 object-cover'}`}
        onClick={() => setIsZoomed(true)}
      />

      {/* Zoomed image overlay */}
      {isZoomed && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          onClick={() => setIsZoomed(false)}
        >
          <div 
            className="relative max-w-3xl max-h-[80vh] overflow-hidden rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={src}
              alt={alt}
              className="max-w-full max-h-[80vh] object-contain"
            />
            <button
              className="absolute top-2 right-2 bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center"
              onClick={() => setIsZoomed(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


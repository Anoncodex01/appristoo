import React from 'react';

interface ImageOptimizerProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export function ImageOptimizer({ 
  src, 
  alt, 
  width = 400, 
  height = 300, 
  className 
}: ImageOptimizerProps) {
  // Default aspect ratio if no dimensions provided
  const aspectRatio = height / width;

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      style={{ aspectRatio }}
      className={className}
    />
  );
}
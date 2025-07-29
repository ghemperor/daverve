import React, { useState, useRef, useEffect, useMemo } from 'react';
import { LoadingSkeleton } from './LoadingSpinner';

// Image cache for better performance - NO UI CHANGES
const imageCache = new Map();

const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  fallbackSrc = '/images/placeholder.jpg',
  lazy = true,
  onLoad: externalOnLoad,
  ...props 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const imgRef = useRef(null);

  // Memoized optimized image source for better performance
  const optimizedSrc = useMemo(() => {
    if (!src) return src;
    
    // Check cache first
    if (imageCache.has(src)) {
      return imageCache.get(src);
    }
    
    // For external URLs, add compression parameters if possible
    try {
      const url = new URL(src);
      // Add WebP format preference and compression (if supported by CDN)
      if (url.hostname.includes('unsplash') || url.hostname.includes('picsum')) {
        url.searchParams.set('fm', 'webp');
        url.searchParams.set('q', '85'); // Quality 85%
        const optimized = url.toString();
        imageCache.set(src, optimized);
        return optimized;
      }
    } catch (e) {
      // Invalid URL, return as-is
    }
    
    imageCache.set(src, src);
    return src;
  }, [src]);

  useEffect(() => {
    if (!lazy) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [lazy]);

  const handleLoad = () => {
    setIsLoading(false);
    if (externalOnLoad) {
      externalOnLoad();
    }
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const imageSrc = hasError ? fallbackSrc : optimizedSrc;

  return (
    <div ref={imgRef} className="relative w-full h-full" {...props}>
      {isLoading && (
        <LoadingSkeleton className="absolute inset-0 z-10" />
      )}
      {isInView && (
        <img
          src={imageSrc}
          alt={alt}
          className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={handleLoad}
          onError={handleError}
          loading={lazy ? 'lazy' : 'eager'}
        />
      )}
    </div>
  );
};

export default OptimizedImage;
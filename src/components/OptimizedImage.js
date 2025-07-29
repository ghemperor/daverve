import React, { useState, useRef, useEffect } from 'react';
import { LoadingSkeleton } from './LoadingSpinner';

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

  const imageSrc = hasError ? fallbackSrc : src;

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
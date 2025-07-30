import React from 'react';

export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizeClasses[size]} border-2 border-gray-200 border-t-black rounded-full animate-spin`}></div>
    </div>
  );
};

export const LoadingSkeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
);

export const ProductCardSkeleton = () => (
  <div className="group text-left">
    <div className="relative rounded-lg mb-3 overflow-hidden aspect-[3/4] bg-gray-200">
      <LoadingSkeleton className="h-full w-full" />
    </div>
    <div className="px-2">
      <LoadingSkeleton className="h-4 w-3/4 mb-2" />
      <LoadingSkeleton className="h-3 w-1/2" />
    </div>
  </div>
);

export default LoadingSpinner;
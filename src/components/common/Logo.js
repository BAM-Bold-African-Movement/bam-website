import React, { useState } from 'react';
import { IMAGES } from '../../constants/images';

const Logo = ({ className = "h-8 w-auto" }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative flex items-center">
      <div className={`relative ${className}`}>
        <img
          className={`${className} transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          src={hasError ? IMAGES.FALLBACK_LOGO : IMAGES.LOGO}
          alt="BAM Logo"
          onError={(e) => {
            console.error('Logo failed to load');
            setHasError(true);
          }}
          onLoad={() => setIsLoading(false)}
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse bg-gray-700 rounded-full h-full w-full" />
          </div>
        )}
      </div>
      {(hasError || isLoading) && (
        <span className="ml-2 text-white text-xl font-bold">BAM</span>
      )}
    </div>
  );
};

export default Logo; 
import React, { useState } from 'react';

const ImageWithSkeleton = ({ src, alt, className }) => {
  const [loading, setLoading] = useState(true);

  return (
    <div className={`relative mt-2 ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse rounded-lg">
          {/* Skeleton placeholder */}
        </div>
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoading(false)}
        // Use max-w-full and responsive classes so it fits the container
        className={`rounded-lg max-w-full ${loading ? 'invisible' : 'visible'}`}
      />
    </div>
  );
};

export default ImageWithSkeleton;

import React, { useEffect, useRef } from 'react';

interface InfiniteScrollProps {
  onLoadMore: () => void;
  hasMore: boolean;
  loading: boolean;
  children: React.ReactNode;
}

export function InfiniteScroll({ onLoadMore, hasMore, loading, children }: InfiniteScrollProps) {
  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [onLoadMore, hasMore, loading]);

  return (
    <div className="transition-opacity duration-300 ease-in-out">
      {children}
      <div 
        ref={observerTarget} 
        className={`h-20 flex items-center justify-center transition-opacity duration-300 ${
          loading ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {loading && (
          <img 
            src="/infinite.svg" 
            alt="Loading more products..." 
            className="w-12 h-12 animate-spin-slow"
          />
        )}
      </div>
    </div>
  );
}

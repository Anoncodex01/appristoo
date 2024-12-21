import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageSlideshowProps {
  images: string[];
  productName: string;
}

export function ImageSlideshow({ images, productName }: ImageSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="relative">
      <div className="aspect-square overflow-hidden rounded-lg">
        <img 
          src={images[currentIndex]} 
          alt={`${productName} - Image ${currentIndex + 1}`}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Navigation Buttons */}
      <button 
        onClick={goToPrevious}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button 
        onClick={goToNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Thumbnail Navigation */}
      <div className="flex gap-2 mt-4">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-16 h-16 rounded-md overflow-hidden border-2 transition-colors
              ${currentIndex === index ? 'border-purple-600' : 'border-transparent'}`}
          >
            <img 
              src={image} 
              alt={`${productName} - Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
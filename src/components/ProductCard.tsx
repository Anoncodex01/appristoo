import React from 'react';
import { Clock, Phone, MessageSquare, Heart } from 'lucide-react';
import { Product } from '../types';
import { ImageOptimizer } from './ImageOptimizer';
import { SHIPPING_TIME, CONTACT_INFO } from '../config/constants';
import { useWishlist } from '../hooks/useWishlist';
import { formatPrice } from '../utils/formatting';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const minPrice = product.priceRanges?.[0]?.price ?? 0;

  const handleCall = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = `tel:${CONTACT_INFO.phone}`;
  };

  const handleMessage = (e: React.MouseEvent) => {
    e.preventDefault();
    const message = encodeURIComponent(
      `Hi, I'm interested in purchasing:\n\n` +
      `Product: ${product.name}\n` +
      `ID: ${product.id}\n\n` +
      `Please provide more information about pricing and availability.`
    );
    window.location.href = `https://wa.me/${CONTACT_INFO.whatsapp}?text=${message}`;
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product.id);
  };

  return (
    <div className="group relative bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <button
        onClick={handleWishlist}
        className={`absolute right-4 top-4 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm
          ${isInWishlist(product.id) 
            ? 'text-red-500 hover:text-red-600' 
            : 'text-gray-400 hover:text-gray-600'
          } transition-colors`}
      >
        <Heart className="w-5 h-5" fill={isInWishlist(product.id) ? "currentColor" : "none"} />
      </button>
      
      <a href={`/product/${product.id}`} className="block">
        <ImageOptimizer
          src={product.images[0]} 
          alt={product.name}
          width={400}
          height={300}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300 bg-gray-100"
        />
      </a>
      
      <div className="p-5">
        <a href={`/product/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 mb-3 group-hover:text-purple-600 transition-colors">
            {product.name}
          </h3>
        </a>
        
        <p className="text-purple-600 font-bold text-2xl mb-3">
          {formatPrice(minPrice)}
        </p>
        
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
          <Clock className="w-4 h-4" />
          <span>Delivery: {SHIPPING_TIME}</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4">
          Min. Order: {product.minOrder} piece(s)
        </p>
        
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleCall}
            className="flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-3 rounded-xl hover:bg-purple-700 transition-all text-sm font-medium shadow-sm hover:shadow-md"
          >
            <Phone className="w-4 h-4" />
            <span>Call</span>
          </button>
          <button
            onClick={handleMessage}
            className="flex items-center justify-center gap-2 border-2 border-gray-900 text-gray-900 px-4 py-3 rounded-xl hover:bg-gray-900 hover:text-white transition-all text-sm font-medium"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Message</span>
          </button>
        </div>
      </div>
    </div>
  );
}
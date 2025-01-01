import React from 'react';
import { Clock, Phone } from 'lucide-react';
import { WhatsAppIcon } from '../components/icons/WhatsApp';
import { ImageOptimizer } from './ImageOptimizer';
import { Product } from '../types';
import { CONTACT_INFO, SHIPPING_TIME } from '../config/constants';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../utils/formatting';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const minPrice = product.priceRanges?.[0]?.price ?? 0;

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `tel:${CONTACT_INFO.phone}`;
  };

  const handleMessage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const message = encodeURIComponent(
      `Hi, I'm interested in purchasing:\n\n` +
      `Product: ${product.name}\n` +
      `ID: ${product.id}\n\n` +
      `Please provide more information about pricing and availability.`
    );
    window.location.href = `https://wa.me/${CONTACT_INFO.whatsapp}?text=${message}`;
  };

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    navigate(`/product/${product.id}`);
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden h-[300px] sm:h-[420px] mb-4 sm:mb-0 max-w-[320px] mx-auto group"
    >
      <div 
        onClick={handleClick}
        className="relative h-[140px] sm:h-[250px] overflow-hidden"
      >
        <ImageOptimizer
          src={product.images?.[0] ?? ''}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {minPrice && (
          <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium">
            {formatPrice(minPrice)}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div 
        onClick={handleClick}
        className="p-3 sm:p-4 flex flex-col justify-between h-[160px] sm:h-[170px] cursor-pointer"
      >
        <div>
          <h3 className="text-sm sm:text-lg font-medium line-clamp-2 mb-1 group-hover:text-purple-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-2">
            {product.description}
          </p>
        </div>
        
        <div>
          <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500 mb-2">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>{SHIPPING_TIME}</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCall();
              }}
              className="flex-1 flex items-center justify-center gap-1 sm:gap-2 bg-purple-600 text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-purple-700 transition-colors text-xs sm:text-sm"
            >
              <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Call</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleMessage();
              }}
              className="flex-1 flex items-center justify-center gap-1 sm:gap-2 bg-[#25D366] text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-[#22c55e] transition-colors text-xs sm:text-sm"
            >
              <WhatsAppIcon className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
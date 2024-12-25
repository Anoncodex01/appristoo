import React from 'react';
import { Clock, Phone } from 'lucide-react';
import { Product } from '../types';
import { ImageOptimizer } from './ImageOptimizer';
import { SHIPPING_TIME, CONTACT_INFO } from '../config/constants';
import { formatPrice } from '../utils/formatting';

// WhatsApp Icon component
function WhatsAppIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
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

  return (
    <div className="group relative bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <a href={`/product/${product.id}`} className="block">
        <div className="aspect-square overflow-hidden">
          <ImageOptimizer
            src={product.images?.[0] ?? ''}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>

        <div className="p-4">
          <h3 className="font-medium text-gray-900 group-hover:text-purple-600 transition-colors mb-1 line-clamp-2">
            {product.name}
          </h3>
          <div className="text-sm text-gray-500 mb-4 line-clamp-2">
            {product.description}
          </div>

          <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
            <Clock className="w-4 h-4" />
            <span>{SHIPPING_TIME}</span>
          </div>

          <div className="text-lg font-semibold text-purple-600 mb-4">
            {formatPrice(minPrice)}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCall}
              className="flex-1 flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>Call</span>
            </button>
            <button
              onClick={handleMessage}
              className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-lg hover:bg-[#22c55e] transition-colors"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>
      </a>
    </div>
  );
}
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { Clock, Phone, ChevronLeft } from 'lucide-react';
import { WhatsAppIcon } from '../components/icons/WhatsApp';
import { ImageOptimizer } from '../components/ImageOptimizer';
import { CONTACT_INFO, SHIPPING_TIME } from '../config/constants';
import { formatPrice } from '../utils/formatting';
import { useProduct } from '../hooks/useProduct';

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, loading } = useProduct(id);

  useEffect(() => {
    // Force scroll to top immediately when component mounts
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    // Also handle when product data loads
    if (product) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [product]); // Run when product data changes too

  const handleBack = () => {
    // Scroll to previous position before going back
    window.scrollTo({ top: 0, behavior: 'instant' });
    navigate(-1);
  };

  const handleCall = () => {
    window.location.href = `tel:${CONTACT_INFO.phone}`;
  };

  const handleMessage = () => {
    const message = encodeURIComponent(`Hi, I'm interested in ${product?.name}`);
    window.location.href = `https://wa.me/${CONTACT_INFO.whatsapp}?text=${message}`;
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="animate-pulse">
          <div className="h-[300px] sm:h-[400px] bg-gray-200 rounded-lg mb-4" />
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-4/6" />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900">Product not found</h2>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        {/* Back button */}
        <button
          onClick={handleBack}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          <span>Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="relative overflow-hidden rounded-2xl bg-gray-100">
            <div className="aspect-square">
              <ImageOptimizer
                src={product.images?.[0] ?? ''}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            {product.price_ranges?.[0]?.price && (
              <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-lg font-medium">
                {formatPrice(product.price_ranges[0].price)}
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <Clock className="w-4 h-4" />
                <span>{SHIPPING_TIME}</span>
              </div>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Specifications */}
            {product.specifications && product.specifications.length > 0 && (
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-xl font-semibold mb-4">Specifications</h2>
                <ul className="space-y-2">
                  {product.specifications.map((spec, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <span className="w-2 h-2 bg-purple-600 rounded-full mr-2" />
                      {spec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg lg:relative lg:p-0 lg:shadow-none border-t lg:border-0">
              <div className="flex gap-4 max-w-lg mx-auto lg:mx-0">
                <button
                  onClick={handleCall}
                  className="flex-1 flex items-center justify-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  <span className="font-medium">Call</span>
                </button>
                <button
                  onClick={handleMessage}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-xl hover:bg-[#22c55e] transition-colors"
                >
                  <WhatsAppIcon className="w-5 h-5" />
                  <span className="font-medium">WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

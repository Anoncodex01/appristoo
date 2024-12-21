import React from 'react';
import { useProducts } from '../../hooks/useProducts';
import { formatPrice } from '../../utils/formatting';
import { Clock, Package } from 'lucide-react';

export function RecentProducts() {
  const { products, loading } = useProducts();
  const recentProducts = products.slice(0, 5); // Show only last 5 products

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-12 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (recentProducts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center text-gray-500">
          <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-lg">No products added yet</p>
          <p className="text-sm mt-2">Products will appear here once added</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-semibold">Recently Added Products</h2>
        </div>
      </div>
      <div className="divide-y divide-gray-200">
        {recentProducts.map(product => (
          <div key={product.id} className="p-4 hover:bg-gray-50">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 flex-shrink-0">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="h-12 w-12 rounded-lg object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {product.name}
                </p>
                <p className="text-sm text-gray-500">
                  {product.category}
                </p>
              </div>
              <div className="text-sm font-medium text-purple-600">
                {product.priceRanges?.[0] ? formatPrice(product.priceRanges[0].price) : 'N/A'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
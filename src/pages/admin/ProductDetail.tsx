import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { AdminLayout } from '../../layouts/AdminLayout';
import { useProduct } from '../../hooks/useProducts';
import { ProductForm } from '../../components/admin/ProductForm';
import { ProductActions } from '../../components/admin/product/ProductActions';
import { ImageSlideshow } from '../../components/ImageSlideshow';
import { PriceRangeTable } from '../../components/product/PriceRangeTable';
import { ProductSpecifications } from '../../components/product/ProductSpecifications';
import { SHIPPING_TIME } from '../../config/constants';

export function AdminProductDetail() {
  const { id } = useParams();
  const { product, loading, error, reloadProduct } = useProduct(id!);
  const [showEditForm, setShowEditForm] = useState(false);

  if (loading) {
    return (
      <AdminLayout title="Product Details">
        <div className="animate-pulse">
          <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !product) {
    return (
      <AdminLayout title="Product Details">
        <div className="text-red-600">
          {error || 'Product not found'}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="Product Details"
      description={`Managing ${product.name}`}
    >
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Images */}
            <div>
              <ImageSlideshow 
                images={product.images} 
                productName={product.name} 
              />
            </div>

            {/* Right Column - Details */}
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                {product.name}
              </h1>

              <PriceRangeTable priceRanges={product.priceRanges} />

              <div className="mb-6">
                <p className="text-gray-600">
                  Shipping Time: {SHIPPING_TIME}
                </p>
                <p className="text-gray-600">
                  Minimum Order: {product.minOrder} piece(s)
                </p>
                <p className="text-gray-600">
                  Status: {product.isArchived ? 'Archived' : 'Active'}
                </p>
              </div>

              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-semibold mb-3">
                    Product Description
                  </h2>
                  <p className="text-gray-600 whitespace-pre-wrap">
                    {product.description}
                  </p>
                </div>

                {product.specifications?.length > 0 && (
                  <ProductSpecifications 
                    specifications={product.specifications} 
                  />
                )}

                <ProductActions
                  product={product}
                  onEdit={() => setShowEditForm(true)}
                  onRefresh={reloadProduct}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {showEditForm && (
        <ProductForm
          product={product}
          onClose={() => setShowEditForm(false)}
          onSuccess={() => {
            setShowEditForm(false);
            reloadProduct();
          }}
        />
      )}
    </AdminLayout>
  );
}
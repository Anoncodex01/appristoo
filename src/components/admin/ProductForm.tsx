import React, { useState, useRef, type FormEvent } from 'react';
import { X } from 'lucide-react';
import { createProduct, updateProduct } from '../../api/products';
import { CATEGORIES } from '../../config/constants';
import { FormField } from './product-form/FormField';
import { PriceRangeInputs } from './product-form/PriceRangeInputs';
import { Product } from '../../types';

interface ProductFormProps {
  onClose: () => void;
  onSuccess: () => void;
  product?: Product | null;
}

export function ProductForm({ onClose, onSuccess, product }: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Initialize form with existing product data if editing
  const defaultValues = {
    name: product?.name || '',
    description: product?.description || '',
    category: product?.category || CATEGORIES[0],
    minOrder: product?.minOrder || 1,
    images: product?.images?.join('\n') || '',
    specifications: product?.specifications?.join('\n') || ''
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
        
    const formData = new FormData(e.currentTarget);
    setLoading(true);
    setError(null);
    
    try {
      // Validate required fields
      const name = formData.get('name') as string;
      const description = formData.get('description') as string;
      const category = formData.get('category') as string;
      const minOrder = parseInt(formData.get('minOrder') as string) || 1;
      const images = (formData.get('images') as string)
        .split('\n')
        .map(url => url.trim())
        .filter(url => url.length > 0);

      const price1 = parseFloat(formData.get('price1') as string);
      const minQuantity1 = parseInt(formData.get('minQuantity1') as string);
      const maxQuantity1 = parseInt(formData.get('maxQuantity1') as string);
      
      // Validate required fields
      if (!name?.trim()) {
        throw new Error('Product name is required');
      }
      if (!description?.trim()) {
        throw new Error('Product description is required');
      }
      if (!category) {
        throw new Error('Category is required');
      }
      if (images.length === 0) {
        throw new Error('At least one image URL is required');
      }

      // Validate image URLs
      const invalidUrls = images.filter(url => !url.match(/^https?:\/\/.+/));
      if (invalidUrls.length > 0) {
        throw new Error('Please enter valid image URLs (must start with http:// or https://)');
      }
      
      // Validate first price range
      if (isNaN(price1) || price1 <= 0) {
        throw new Error('Please enter a valid price for the first range');
      }
      if (isNaN(minQuantity1) || minQuantity1 < 1) {
        throw new Error('Minimum quantity must be at least 1');
      }
      if (isNaN(maxQuantity1) || maxQuantity1 <= minQuantity1) {
        throw new Error('Maximum quantity must be greater than minimum quantity');
      }
      
      // Build price ranges array
      const priceRanges = [
        {
          minQuantity: minQuantity1,
          maxQuantity: maxQuantity1,
          price: price1
        }
      ];
      
      // Add second price range if provided and valid
      const price2 = parseFloat(formData.get('price2') as string);
      const minQuantity2 = parseInt(formData.get('minQuantity2') as string);
      const maxQuantity2 = parseInt(formData.get('maxQuantity2') as string);
      
      if (!isNaN(price2) && !isNaN(minQuantity2) && !isNaN(maxQuantity2)) {
        if (price2 <= 0) {
          throw new Error('Second range price must be greater than 0');
        }
        if (minQuantity2 <= maxQuantity1) {
          throw new Error('Second range minimum quantity must be greater than first range maximum');
        }
        if (maxQuantity2 <= minQuantity2) {
          throw new Error('Second range maximum quantity must be greater than its minimum');
        }

        priceRanges.push({
          minQuantity: minQuantity2,
          maxQuantity: maxQuantity2,
          price: price2
        });
      }
      
      // Build product data
      const productData = {
        name: name.trim(),
        description: description.trim(),
        category,
        minOrder,
        images,
        priceRanges,
        specifications: (formData.get('specifications') as string)
          .split('\n')
          .map(spec => spec.trim())
          .filter(spec => spec.length > 0)
      };

      // Create or update product
      if (product) {
        await updateProduct(product.id, productData);
      } else {
        const result = await createProduct(productData);
        if (!result?.success) {
          throw new Error('Failed to create product. Please try again.');
        }
      }
      
      onSuccess();
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      console.error('Form submission error:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {product ? 'Edit Product' : 'Add New Product'}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField label="Product Name">
              <input
                type="text"
                name="name"
                required
                defaultValue={defaultValues.name}
                className="w-full p-2 border rounded-lg"
              />
            </FormField>

            <FormField label="Description">
              <textarea
                name="description"
                required
                defaultValue={defaultValues.description}
                rows={3}
                className="w-full p-2 border rounded-lg"
              />
            </FormField>

            <FormField label="Category">
              <select
                name="category"
                required
                defaultValue={defaultValues.category}
                className="w-full p-2 border rounded-lg"
              >
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Image URLs (one per line)">
              <textarea
                name="images"
                required
                defaultValue={defaultValues.images}
                rows={3}
                className="w-full p-2 border rounded-lg"
                placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
              />
            </FormField>

            <FormField label="Minimum Order">
              <input
                type="number"
                name="minOrder"
                required
                min="1"
                defaultValue={defaultValues.minOrder}
                className="w-full p-2 border rounded-lg"
              />
            </FormField>

            <div className="space-y-4">
              <h3 className="font-medium">Price Ranges</h3>
              <PriceRangeInputs 
                index={1} 
                required 
                defaultValues={product?.priceRanges[0]}
              />
              <PriceRangeInputs 
                index={2}
                defaultValues={product?.priceRanges[1]}
              />
            </div>

            <FormField label="Specifications (one per line)">
              <textarea
                name="specifications"
                rows={3}
                defaultValue={defaultValues.specifications}
                className="w-full p-2 border rounded-lg"
                placeholder="4K Resolution&#10;Smart Features&#10;HDR Support"
              />
            </FormField>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                disabled={loading}
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
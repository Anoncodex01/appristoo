import { PriceRange } from '../types';

export const formatProducts = (products: any[]) => {
  return products.map(product => ({
    id: product.id,
    name: product.name,
    description: product.description,
    category: product.category,
    minOrder: product.min_order,
    isArchived: product.is_archived,
    priceRanges: product.price_ranges.map((range: any) => ({
      minQuantity: range.min_quantity,
      maxQuantity: range.max_quantity,
      price: range.price
    })),
    images: product.product_images.map((img: any) => img.image_url),
    specifications: product.product_specifications?.map((spec: any) => spec.specification) || []
  }));
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-TZ', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: 0
  }).format(price);
};

export const formatQuantityRange = (range: PriceRange): string => {
  return `${range.minQuantity} - ${range.maxQuantity} pieces`;
};
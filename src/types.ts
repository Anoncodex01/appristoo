export type Category = typeof import('./config/constants').CATEGORIES[number];

export interface Product {
  id: string;
  name: string;
  description: string;
  category: Category;
  images?: string[];
  minOrder?: number;
  priceRanges?: {
    minQuantity: number;
    maxQuantity: number;
    price: number;
  }[];
  specifications?: string[];
  is_archived?: boolean;
}

export interface PriceRange {
  minQuantity: number;
  maxQuantity: number;
  price: number;
}

export interface ProductImage {
  product_id: string;
  image_url: string;
  display_order: number;
}

export interface ProductSpecification {
  product_id: string;
  specification: string;
}

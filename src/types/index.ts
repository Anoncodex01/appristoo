export interface PriceRange {
  minQuantity: number;
  maxQuantity: number;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  priceRanges: PriceRange[];
  category: Category;
  images: string[];  // Changed from single image to array of images
  description: string;
  specifications?: string[];
  minOrder?: number;
  isArchived?: boolean;
}

export type Category = 'BEAUTY' | 'ELECTRONICS' | 'HOME APPLIANCES';

export interface ContactInfo {
  phone: string;
  whatsapp: string;
}
import { products as sampleProducts } from '../../data/products';
import type { Product } from '../../types';

// Fallback data provider when Supabase is unavailable
export class FallbackDataProvider {
  private static instance: FallbackDataProvider;
  private products: Product[] = [...sampleProducts];

  private constructor() {}

  static getInstance(): FallbackDataProvider {
    if (!FallbackDataProvider.instance) {
      FallbackDataProvider.instance = new FallbackDataProvider();
    }
    return FallbackDataProvider.instance;
  }

  async getProducts(): Promise<Product[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.products.filter(p => !p.isArchived);
  }

  async getCategoryProductCounts(): Promise<Record<string, number>> {
    const activeProducts = this.products.filter(p => !p.isArchived);
    return activeProducts.reduce((acc: Record<string, number>, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {});
  }

  async getProductById(id: string): Promise<Product | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const product = this.products.find(p => p.id === id && !p.isArchived);
    if (!product) return null;
    return {
      ...product,
      priceRanges: product.priceRanges || [],
      images: product.images || [],
      specifications: product.specifications || []
    };
  }
}
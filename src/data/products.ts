import { Product } from '../types';

export const products: Product[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Premium 4K Smart TV 55"',
    priceRanges: [
      { minQuantity: 1, maxQuantity: 5, price: 899999 },
      { minQuantity: 6, maxQuantity: 20, price: 849999 }
    ],
    category: 'ELECTRONICS',
    images: [
      'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&q=80&w=1000'
    ],
    description: '55" Premium 4K Smart TV with HDR, built-in streaming apps, and voice control',
    specifications: [
      '4K Ultra HD Resolution',
      'Smart TV Features',
      'HDR Support',
      'Voice Control',
      'Multiple HDMI Ports'
    ],
    minOrder: 1
  },
  {
    id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    name: 'Smart Air Conditioner',
    priceRanges: [
      { minQuantity: 1, maxQuantity: 3, price: 749999 },
      { minQuantity: 4, maxQuantity: 10, price: 699999 }
    ],
    category: 'HOME APPLIANCES',
    images: [
      'https://images.unsplash.com/photo-1614633833026-0820552978b6?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1624926272725-02fbb4c652cd?auto=format&fit=crop&q=80&w=1000'
    ],
    description: 'Smart inverter air conditioner with WiFi control and energy-saving features',
    specifications: [
      'WiFi Control',
      'Energy Saving Mode',
      'Smart Temperature Control',
      'Timer Function',
      'Sleep Mode'
    ],
    minOrder: 1
  },
  {
    id: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
    name: 'Luxury Skincare Set',
    priceRanges: [
      { minQuantity: 1, maxQuantity: 10, price: 129999 },
      { minQuantity: 11, maxQuantity: 50, price: 119999 }
    ],
    category: 'BEAUTY',
    images: [
      'https://images.unsplash.com/photo-1570554886111-e80fcca6a029?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=1000'
    ],
    description: 'Premium skincare set including cleanser, toner, serum, and moisturizer',
    specifications: [
      'All Natural Ingredients',
      'Suitable for All Skin Types',
      'Paraben Free',
      'Dermatologically Tested'
    ],
    minOrder: 1
  }
];
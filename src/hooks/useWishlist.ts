import { useState, useEffect } from 'react';
import { Product } from '../types';
import { supabase } from '../lib/supabase';

const resetWishlistState = (setWishlist: any, setWishlistIds: any, setLoading: any) => {
  setWishlist([]);
  setWishlistIds(new Set());
  setLoading(false);
};

export function useWishlist() {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());

  const loadWishlist = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        resetWishlistState(setWishlist, setWishlistIds, setLoading);
        return;
      }

      const { data: wishlistData, error: wishlistError } = await supabase
        .from('wishlists')
        .select(`
          product_id,
          products (
            id,
            name,
            description,
            category,
            min_order,
            is_archived,
            price_ranges!inner (min_quantity, max_quantity, price),
            product_images!inner (image_url),
            product_specifications (specification)
          )
        `)
        .eq('user_id', user.id);

      if (wishlistError) {
        if (wishlistError.code !== 'PGRST116') {
          console.error('Error fetching wishlist:', wishlistError.message);
        }
        resetWishlistState(setWishlist, setWishlistIds, setLoading);
        return;
      }

      const products = (wishlistData || [])
        .map(item => item.products)
        .filter(p => !p.is_archived)
        .map(p => ({
          id: p.id,
          name: p.name,
          description: p.description,
          category: p.category,
          minOrder: p.min_order,
          isArchived: p.is_archived,
          priceRanges: p.price_ranges,
          images: p.product_images.map((img: any) => img.image_url),
          specifications: p.product_specifications?.map((spec: any) => spec.specification) || []
        }));

      setWishlist(products);
      setWishlistIds(new Set(products.map(p => p.id)));
    } catch (error) {
      console.error('Error loading wishlist:', error instanceof Error ? error.message : 'Network error');
      // Don't throw on network errors, just reset state
      resetWishlistState(setWishlist, setWishlistIds, setLoading);
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async (productId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user?.id) {
      window.location.href = '/admin/login';
      return;
    }

    // Validate UUID format
    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!UUID_REGEX.test(productId)) {
      console.error('Invalid product ID format');
      return;
    }

    try {
      setLoading(true);

      if (wishlistIds.has(productId)) {
        await supabase
          .from('wishlists')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);
        
        setWishlistIds(prev => {
          const next = new Set(prev);
          next.delete(productId);
          return next;
        });
      } else {
        await supabase
          .from('wishlists')
          .insert({ user_id: user.id, product_id: productId });
        
        setWishlistIds(prev => new Set([...prev, productId]));
      }

      await loadWishlist();
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      if (error instanceof Error && error.message.includes('invalid input syntax for type uuid')) {
        console.error('Invalid UUID format for product ID');
      } else {
        alert('Failed to update wishlist. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  return {
    wishlist,
    loading,
    isInWishlist: (productId: string) => wishlistIds.has(productId),
    toggleWishlist,
    wishlistCount: wishlistIds.size
  };
}
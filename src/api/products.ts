import { supabase } from '../lib/supabase';
import type { Product } from '../types';


export async function fetchProducts() {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      description,
      category,
      min_order,
      is_archived,
      price_ranges (min_quantity, max_quantity, price),
      product_images (image_url),
      product_specifications (specification)
    `)
    .eq('is_archived', false)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }

  if (!data) {
    return [];
  }

  return data.map((product: any): Product => ({
    id: product.id,
    name: product.name,
    description: product.description,
    category: product.category,
    minOrder: product.min_order,
    isArchived: product.is_archived,
    priceRanges: (product.price_ranges || []).map((range: any) => ({
      minQuantity: range.min_quantity,
      maxQuantity: range.max_quantity,
      price: range.price
    })),
    images: (product.product_images || []).map((img: any) => img.image_url),
    specifications: product.product_specifications?.map((spec: any) => spec.specification) || []
  }));
}

export async function fetchProductById(id: string) {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      description,
      category,
      min_order,
      is_archived,
      price_ranges (min_quantity, max_quantity, price),
      product_images (image_url),
      product_specifications (specification)
    `)
    .eq('id', id)
    .single();

  if (error) {
    // Check if product exists in fallback data
    const provider = await getDataProvider();
    if (!('from' in provider)) {
      const fallbackProduct = await provider.getProductById(id);
      if (fallbackProduct) return fallbackProduct;
    }
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    category: data.category,
    minOrder: data.min_order,
    isArchived: data.is_archived,
    priceRanges: data.price_ranges.map((range: any) => ({
      minQuantity: range.min_quantity,
      maxQuantity: range.max_quantity,
      price: range.price
    })),
    images: data.product_images.map((img: any) => img.image_url),
    specifications: data.product_specifications?.map((spec: any) => spec.specification) || []
  };
}

export async function createProduct(productData: any) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');
  
  // Validate user role
  const { data: roleData, error: roleError } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (roleError || !roleData) {
    throw new Error('Unauthorized - Invalid user role');
  }

  if (!['ADMIN', 'EDITOR'].includes(roleData.role)) {
    throw new Error('Unauthorized - Insufficient permissions');
  }

  const productId = crypto.randomUUID();
  const timestamp = new Date().toISOString();

  try {
    // Insert product first
    const { error: productError } = await supabase
      .from('products')
      .insert({
        id: productId,
        name: productData.name,
        description: productData.description,
        category: productData.category,
        min_order: productData.minOrder,
        is_archived: false,
        created_at: timestamp
      })
      .single();
    
    if (productError) throw productError;
    
    // Insert all related data in parallel
    const [imagesResult, pricesResult, specsResult] = await Promise.all([
      // Insert images
      supabase
      .from('product_images')
      .insert(
        productData.images.map((url: string, index: number) => ({
          id: crypto.randomUUID(),
          product_id: productId,
          image_url: url,
          display_order: index,
          created_at: timestamp
        }))
      ),
      // Insert price ranges
      supabase
      .from('price_ranges')
      .insert(
        productData.priceRanges.map((range: any) => ({
          id: crypto.randomUUID(),
          product_id: productId,
          min_quantity: range.minQuantity,
          max_quantity: range.maxQuantity,
          price: range.price,
          created_at: timestamp
        }))
      ),
      // Insert specifications if any
      productData.specifications?.length ? supabase
        .from('product_specifications')
        .insert(
          productData.specifications.map((spec: string) => ({
            id: crypto.randomUUID(),
            product_id: productId,
            specification: spec,
            created_at: timestamp
          }))
        ) : Promise.resolve({ error: null })
    ]);

    // Check for errors
    const errors = [
      imagesResult.error,
      pricesResult.error,
      specsResult.error
    ].filter(Boolean);

    if (errors.length > 0) {
      // If any operation failed, delete the product (this will cascade delete related data)
      await supabase
        .from('products')
        .delete()
        .eq('id', productId);
      
      throw new Error('Failed to create product: ' + errors[0]?.message);
    }

    return { id: productId };
  } catch (error) {
    console.error('Error creating product:', error);
    
    let errorMessage = 'Failed to create product';
    
    if (error instanceof Error) {
      errorMessage = error.message;
      if (error.message.includes('duplicate key')) errorMessage = 'A product with this ID already exists';
      if (error.message.includes('permission denied')) errorMessage = 'You do not have permission to create products';
      if (error.message.includes('violates foreign key constraint')) errorMessage = 'Invalid product data';
    }
    
    throw new Error(errorMessage);
  }
}

export async function updateProduct(id: string, productData: any) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');
  
  // Update main product
  const { error: productError } = await supabase
    .from('products')
    .update({
      name: productData.name,
      description: productData.description,
      category: productData.category,
      min_order: productData.minOrder
    })
    .eq('id', id);

  if (productError) throw productError;

  // Delete existing related data
  const { error: deleteImagesError } = await supabase
    .from('product_images')
    .delete()
    .eq('product_id', id);

  if (deleteImagesError) throw deleteImagesError;

  const { error: deletePricesError } = await supabase
    .from('price_ranges')
    .delete()
    .eq('product_id', id);

  if (deletePricesError) throw deletePricesError;

  const { error: deleteSpecsError } = await supabase
    .from('product_specifications')
    .delete()
    .eq('product_id', id);

  if (deleteSpecsError) throw deleteSpecsError;

  // Insert new images
  const { error: imagesError } = await supabase
    .from('product_images')
    .insert(
      productData.images.map((url: string, index: number) => ({
        id: crypto.randomUUID(),
        product_id: id,
        image_url: url,
        display_order: index
      }))
    );

  if (imagesError) throw imagesError;

  // Insert new price ranges
  const { error: pricesError } = await supabase
    .from('price_ranges')
    .insert(
      productData.priceRanges.map((range: any) => ({
        id: crypto.randomUUID(),
        product_id: id,
        min_quantity: range.minQuantity,
        max_quantity: range.maxQuantity,
        price: range.price
      }))
    );

  if (pricesError) throw pricesError;

  // Insert new specifications if any
  if (productData.specifications?.length) {
    const { error: specsError } = await supabase
      .from('product_specifications')
      .insert(
        productData.specifications.map((spec: string) => ({
          id: crypto.randomUUID(),
          product_id: id,
          specification: spec
        }))
      );

    if (specsError) throw specsError;
  }

  return { id };
}

export async function deleteProduct(id: string) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function toggleArchiveProduct(id: string, isArchived: boolean) {
  const { error } = await supabase
    .from('products')
    .update({ is_archived: isArchived })
    .eq('id', id);

  if (error) throw error;
}
import React from 'react';
import { Pencil, Archive, ArchiveRestore, Trash2 } from 'lucide-react';
import { Product } from '../../../types';
import { deleteProduct, toggleArchiveProduct } from '../../../api/products';

interface ProductActionsProps {
  product: Product;
  onEdit: (product: Product) => void;
  onRefresh: () => void;
}

export function ProductActions({ product, onEdit, onRefresh }: ProductActionsProps) {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isArchiving, setIsArchiving] = React.useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      setIsDeleting(true);
      await deleteProduct(product.id);
      onRefresh();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleArchive = async () => {
    try {
      setIsArchiving(true);
      await toggleArchiveProduct(product.id, !product.isArchived);
      onRefresh();
    } catch (error) {
      console.error('Error archiving product:', error);
      alert('Failed to update product status');
    } finally {
      setIsArchiving(false);
    }
  };

  return (
    <div className="flex gap-4 mt-8 border-t pt-8">
      <button
        onClick={() => onEdit(product)}
        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
      >
        <Pencil className="w-4 h-4" />
        Edit Product
      </button>
      
      <button
        onClick={handleArchive}
        disabled={isArchiving}
        className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
      >
        {product.isArchived ? (
          <>
            <ArchiveRestore className="w-4 h-4" />
            Restore Product
          </>
        ) : (
          <>
            <Archive className="w-4 h-4" />
            Archive Product
          </>
        )}
      </button>
      
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        <Trash2 className="w-4 h-4" />
        Delete Product
      </button>
    </div>
  );
}
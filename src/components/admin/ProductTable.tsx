import React, { useState } from 'react';
import { Pencil, Trash2, Archive, ArchiveRestore } from 'lucide-react';
import { Product } from '../../types';
import { formatPrice } from '../../utils/formatting';
import { deleteProduct, toggleArchiveProduct } from '../../api/products';

interface ProductTableProps {
  products: Product[];
  loading: boolean;
  onRefresh: () => void;
  onEdit: (product: Product) => void;
}

export function ProductTable({ products, loading, onRefresh, onEdit }: ProductTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [archivingId, setArchivingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      setDeletingId(id);
      await deleteProduct(id);
      onRefresh();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    } finally {
      setDeletingId(null);
    }
  };

  const handleArchive = async (id: string, currentStatus: boolean) => {
    try {
      setArchivingId(id);
      await toggleArchiveProduct(id, !currentStatus);
      onRefresh();
    } catch (error) {
      console.error('Error archiving product:', error);
      alert('Failed to update product status');
    } finally {
      setArchivingId(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-12 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-[800px] w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-[35%] px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="w-[20%] px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="w-[15%] px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="w-[15%] px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Min Qty
              </th>
              <th className="w-[15%] px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map(product => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img 
                        className="h-10 w-10 rounded-lg object-cover"
                        src={product.images[0]}
                        alt={product.name}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 truncate max-w-[250px]">
                        {product.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                    {product.category}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500"> 
                  {product.priceRanges?.[0] ? formatPrice(product.priceRanges[0].price) : 'N/A'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {product.minOrder}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    className="text-indigo-600 hover:text-indigo-900"
                    onClick={() => onEdit(product)}
                    title="Edit product"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    className="ml-3 text-orange-600 hover:text-orange-900"
                    onClick={() => handleArchive(product.id, product.isArchived)}
                    disabled={archivingId === product.id}
                    title={product.isArchived ? "Restore product" : "Archive product"}
                  >
                    {product.isArchived ? (
                      <ArchiveRestore className="w-4 h-4" />
                    ) : (
                      <Archive className="w-4 h-4" />
                    )}
                  </button>
                  <button 
                    className="ml-3 text-red-600 hover:text-red-900"
                    onClick={() => handleDelete(product.id)}
                    disabled={deletingId === product.id}
                    title="Delete product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
@@ .. @@
-import { Plus } from 'lucide-react';
+import { Plus, Search } from 'lucide-react';
 import { AdminLayout } from '../../layouts/AdminLayout';
 import { ProductTable } from '../../components/admin/ProductTable';
 import { ProductForm } from '../../components/admin/ProductForm';
 import { useProducts } from '../../hooks/useProducts';
+import { Pagination } from '../Pagination';
 
 export function ProductList() {
   const [showForm, setShowForm] = useState(false);
   const [editingProduct, setEditingProduct] = useState<Product | null>(null);
-  const { products, loading, error, reloadProducts } = useProducts();
+  const {
+    products,
+    loading,
+    error,
+    totalPages,
+    currentPage,
+    setCurrentPage,
+    searchQuery,
+    setSearchQuery,
+    reloadProducts
+  } = useProducts();
 
   const handleEdit = (product: Product) => {
     setEditingProduct(product);
@@ .. @@
     setEditingProduct(null);
   };
 
+  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
+    e.preventDefault();
+    setCurrentPage(1); // Reset to first page when searching
+  };
+
   return (
     <AdminLayout 
       title="Products"
       description="Manage your product catalog"
     >
-      <div className="flex justify-end mb-8">
+      <div className="flex justify-between items-center mb-8">
+        <form onSubmit={handleSearch} className="relative w-96">
+          <input
+            type="text"
+            value={searchQuery}
+            onChange={(e) => setSearchQuery(e.target.value)}
+            placeholder="Search products..."
+            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
+          />
+          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
+        </form>
+
         <button
           onClick={() => setShowForm(true)}
           className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700"
@@ .. @@
         onEdit={handleEdit}
         onRefresh={reloadProducts}
       />
+      
+      {totalPages > 1 && (
+        <div className="mt-8">
+          <Pagination
+            currentPage={currentPage}
+            totalPages={totalPages}
+            onPageChange={setCurrentPage}
+          />
+        </div>
+      )}
 
       {showForm && (
         <ProductForm
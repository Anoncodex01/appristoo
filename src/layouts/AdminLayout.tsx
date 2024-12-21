import React from 'react';
import { LayoutGrid, Package, Settings, Users } from 'lucide-react';
import { AdminNav } from '../components/admin/AdminNav';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export function AdminLayout({ children, title, description }: AdminLayoutProps) {
  const menuItems = [
    { icon: <LayoutGrid className="w-5 h-5" />, label: 'Dashboard', path: '/admin' },
    { icon: <Package className="w-5 h-5" />, label: 'Products', path: '/admin/products' },
    { icon: <Settings className="w-5 h-5" />, label: 'Settings', path: '/admin/settings' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav menuItems={menuItems} />
      <main className="p-4 lg:p-6 lg:ml-64 pt-20">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {description && <p className="text-gray-600">{description}</p>}
        </div>
        {children}
      </main>
    </div>
  );
}
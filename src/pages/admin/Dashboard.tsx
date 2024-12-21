import React from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { DashboardStats } from '../../components/admin/DashboardStats';
import { RecentProducts } from '../../components/admin/RecentProducts';

export function Dashboard() {
  return (
    <AdminLayout 
      title="Dashboard"
      description="Welcome to your admin dashboard"
    >
      <DashboardStats />
      <RecentProducts />
    </AdminLayout>
  );
}
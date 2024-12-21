import React, { useState, useEffect } from 'react';
import { Package, DollarSign, ShoppingCart } from 'lucide-react';
import { StatCard } from './stats/StatCard';
import { supabase } from '../../lib/supabase';

export function DashboardStats() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    averagePrice: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        // Get total products count
        const { count: totalProducts, error: countError } = await supabase
          .from('products') 
          .select('*', { count: 'exact', head: true })
          .eq('is_archived', false);

        if (countError) throw countError;

        // Get unique categories
        const { data: categories, error: categoriesError } = await supabase.rpc(
          'get_active_categories_count'
        );

        if (categoriesError) throw categoriesError;

        // Get average base price
        const { data: priceData, error: priceError } = await supabase
          .from('price_ranges')
          .select('product_id, price')
          .order('min_quantity', { ascending: true })
          .limit(1);

        if (priceError) throw priceError;

        // Group by product and get minimum price for each
        const productPrices = new Map();
        priceData?.forEach(pr => {
          if (!productPrices.has(pr.product_id) || pr.price < productPrices.get(pr.product_id)) {
            productPrices.set(pr.product_id, pr.price);
          }
        });

        // Calculate average of minimum prices
        const prices = Array.from(productPrices.values());
        const avgPrice = prices.length > 0
          ? prices.reduce((acc, price) => acc + price, 0) / prices.length
          : 0;

        setStats({
          totalProducts: totalProducts || 0,
          totalCategories: categories || 0,
          averagePrice: avgPrice || 0
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse bg-white p-6 rounded-lg shadow-sm h-32" />
        ))}
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Products',
      value: stats.totalProducts,
      icon: <Package className="w-6 h-6" />,
      color: 'bg-blue-500',
    },
    {
      label: 'Total Categories',
      value: stats.totalCategories,
      icon: <ShoppingCart className="w-6 h-6" />,
      color: 'bg-green-500',
    },
    {
      label: 'Average Price',
      value: new Intl.NumberFormat('en-TZ', {
        style: 'currency',
        currency: 'TZS',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(stats.averagePrice),
      icon: <DollarSign className="w-6 h-6" />,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}
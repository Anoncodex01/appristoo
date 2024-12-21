import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Dashboard } from './pages/admin/Dashboard';
import { ProductList } from './pages/admin/ProductList';
import { AdminProductDetail } from './pages/admin/ProductDetail';
import { Login } from './pages/admin/Login';
import { Settings } from './pages/admin/Settings';
import { AuthGuard } from './components/admin/AuthGuard';
import { WishlistPage } from './pages/WishlistPage';
import { HomePage } from './pages/HomePage';
import { ProductDetail } from './components/ProductDetail';
import { useRecentProducts } from './hooks/useRecentProducts';
import { AboutPage } from './pages/AboutPage';
import { FaqPage } from './pages/FaqPage'; 
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { ShippingPage } from './pages/ShippingPage';

export function App() {
  const { addRecentProduct } = useRecentProducts();

  const router = createBrowserRouter([
    // Admin Routes
    {
      path: "/admin/login",
      element: <Login />
    },
    {
      path: "/admin",
      element: <AuthGuard><Dashboard /></AuthGuard>
    },
    {
      path: "/admin/products",
      element: <AuthGuard><ProductList /></AuthGuard>
    },
    {
      path: "/admin/products/:id",
      element: <AuthGuard><AdminProductDetail /></AuthGuard>
    },
    {
      path: "/admin/settings",
      element: <AuthGuard><Settings /></AuthGuard>
    },
    // Public Routes
    {
      path: "/wishlist",
      element: <WishlistPage />
    },
    {
      path: "/",
      element: <HomePage />
    },
    {
      path: "/product/:id",
      element: <ProductDetail onViewProduct={addRecentProduct} />
    },
    {
      path: "/about",
      element: <AboutPage />
    },
    {
      path: "/faq",
      element: <FaqPage />
    },
    {
      path: "/terms",
      element: <TermsPage />
    },
    {
      path: "/privacy",
      element: <PrivacyPage />
    },
    {
      path: "/shipping",
      element: <ShippingPage />
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App;
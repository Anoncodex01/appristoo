import { createBrowserRouter } from 'react-router-dom';
import { Dashboard } from './pages/admin/Dashboard';
import { ProductList } from './pages/admin/ProductList';
import { AdminProductDetail } from './pages/admin/ProductDetail';
import { Settings } from './pages/admin/Settings';
import { Login } from './pages/admin/Login';
import { AuthGuard } from './components/admin/AuthGuard';
import { HomePage } from './pages/HomePage';
import { ProductDetail } from './components/ProductDetail';
import { AboutPage } from './pages/AboutPage';
import { FaqPage } from './pages/FaqPage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { ShippingPage } from './pages/ShippingPage';

export const router = createBrowserRouter(
  [
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
      path: "/",
      element: <HomePage />
    },
    {
      path: "/product/:id",
      element: <ProductDetail onViewProduct={() => {}} />
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
  ],
  {
    future: {
      v7_startTransition: true,
      v7_normalizeFormMethod: true,
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    }
  }
);

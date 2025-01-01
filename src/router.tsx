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
      element: <Login />,
      loader: () => {
        // Scroll to top on route change
        window.scrollTo({ top: 0, behavior: 'instant' });
        return null;
      }
    },
    {
      path: "/admin",
      element: <AuthGuard><Dashboard /></AuthGuard>,
      loader: () => {
        // Scroll to top on route change
        window.scrollTo({ top: 0, behavior: 'instant' });
        return null;
      }
    },
    {
      path: "/admin/products",
      element: <AuthGuard><ProductList /></AuthGuard>,
      loader: () => {
        // Scroll to top on route change
        window.scrollTo({ top: 0, behavior: 'instant' });
        return null;
      }
    },
    {
      path: "/admin/products/:id",
      element: <AuthGuard><AdminProductDetail /></AuthGuard>,
      loader: () => {
        // Scroll to top on route change
        window.scrollTo({ top: 0, behavior: 'instant' });
        return null;
      }
    },
    {
      path: "/admin/settings",
      element: <AuthGuard><Settings /></AuthGuard>,
      loader: () => {
        // Scroll to top on route change
        window.scrollTo({ top: 0, behavior: 'instant' });
        return null;
      }
    },
    // Public Routes
    {
      path: "/",
      element: <HomePage />,
      loader: () => {
        // Scroll to top on route change
        window.scrollTo({ top: 0, behavior: 'instant' });
        return null;
      }
    },
    {
      path: "/product/:id",
      element: <ProductDetail onViewProduct={() => {}} />,
      loader: () => {
        // Scroll to top on route change
        window.scrollTo({ top: 0, behavior: 'instant' });
        return null;
      }
    },
    {
      path: "/about",
      element: <AboutPage />,
      loader: () => {
        // Scroll to top on route change
        window.scrollTo({ top: 0, behavior: 'instant' });
        return null;
      }
    },
    {
      path: "/faq",
      element: <FaqPage />,
      loader: () => {
        // Scroll to top on route change
        window.scrollTo({ top: 0, behavior: 'instant' });
        return null;
      }
    },
    {
      path: "/terms",
      element: <TermsPage />,
      loader: () => {
        // Scroll to top on route change
        window.scrollTo({ top: 0, behavior: 'instant' });
        return null;
      }
    },
    {
      path: "/privacy",
      element: <PrivacyPage />,
      loader: () => {
        // Scroll to top on route change
        window.scrollTo({ top: 0, behavior: 'instant' });
        return null;
      }
    },
    {
      path: "/shipping",
      element: <ShippingPage />,
      loader: () => {
        // Scroll to top on route change
        window.scrollTo({ top: 0, behavior: 'instant' });
        return null;
      }
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
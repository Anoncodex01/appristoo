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
        window.scrollTo({ top: 0, behavior: 'instant' });
        return null;
      }
    },
    {
      path: "/admin",
      element: <AuthGuard><Dashboard /></AuthGuard>,
      loader: () => {
        window.scrollTo({ top: 0, behavior: 'instant' });
        return null;
      }
    },
    {
      path: "/admin/products",
      element: <AuthGuard><ProductList /></AuthGuard>,
      loader: () => {
        window.scrollTo({ top: 0, behavior: 'instant' });
        return null;
      }
    },
    {
      path: "/admin/products/:id",
      element: <AuthGuard><AdminProductDetail /></AuthGuard>,
      loader: () => {
        window.scrollTo({ top: 0, behavior: 'instant' });
        return null;
      }
    },
    {
      path: "/admin/settings",
      element: <AuthGuard><Settings /></AuthGuard>,
      loader: () => {
        window.scrollTo({ top: 0, behavior: 'instant' });
        return null;
      }
    },
    // Public Routes
    {
      path: "/",
      element: <HomePage />,
      loader: () => {
        window.scrollTo({ top: 0, behavior: 'instant' });
        return null;
      }
    },
    {
      path: "/product/:id",
      element: <ProductDetail onViewProduct={() => {}} />,
      loader: () => {
        window.scrollTo({ top: 0, behavior: 'instant' });
        return null;
      }
    },
    {
      path: "/about",
      element: <AboutPage />,
      loader: () => {
        window.scrollTo({ top: 0, behavior: 'instant' });
        return null;
      }
    },
    {
      path: "/faq",
      element: <FaqPage />,
      loader: () => {
        window.scrollTo({ top: 0, behavior: 'instant' });
        return null;
      }
    },
    {
      path: "/terms",
      element: <TermsPage />,
      loader: () => {
        window.scrollTo({ top: 0, behavior: 'instant' });
        return null;
      }
    },
    {
      path: "/privacy",
      element: <PrivacyPage />,
      loader: () => {
        window.scrollTo({ top: 0, behavior: 'instant' });
        return null;
      }
    },
    {
      path: "/shipping",
      element: <ShippingPage />,
      loader: () => {
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
      v7_skipErrorBoundaryBindings: true,
      v7_skipHostCheck: true,
      v7_skipRedirectHandling: true,
      v7_skipActionErrorBoundaries: true,
      v7_skipActionAbortHanding: true,
      v7_skipActionAbortWhenPreloading: true,
      v7_skipDataLoaderSerialEffectCalls: true,
      v7_skipErrorBoundaryReRendering: true,
      v7_skipErrorBoundaryRendering: true,
      v7_skipErrorBoundaryErrorHandling: true,
      v7_skipErrorBoundaryErrorReporting: true,
      v7_skipErrorBoundaryErrorThrowing: true,
      v7_skipErrorBoundaryErrorPropagation: true,
      v7_skipErrorBoundaryErrorRecovery: true,
      v7_skipActionErrorRevalidation: true,
    }
  }
);
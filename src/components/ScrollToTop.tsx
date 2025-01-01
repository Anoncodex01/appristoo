import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Force scroll to top immediately on route change
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

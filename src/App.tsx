import React from 'react';
import { BrowserRouter, RouterProvider } from 'react-router-dom';
import { router } from './router';
import { useRecentProducts } from './hooks/useRecentProducts';
import { ScrollToTop } from './components/ScrollToTop';

export function App() {
  const { addRecentProduct } = useRecentProducts();

  // Update the onViewProduct handler in the router
  const updatedRouter = {
    ...router,
    routes: router.routes.map(route => {
      if (route.path === '/product/:id') {
        return {
          ...route,
          element: React.cloneElement(route.element as React.ReactElement, {
            onViewProduct: addRecentProduct
          })
        };
      }
      return route;
    })
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <RouterProvider router={updatedRouter as typeof router} />
    </BrowserRouter>
  );
}

export default App;
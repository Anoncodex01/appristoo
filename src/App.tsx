import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { useRecentProducts } from './hooks/useRecentProducts';

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

  return <RouterProvider router={updatedRouter as typeof router} />;
}

export default App;
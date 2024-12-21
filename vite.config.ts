import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteCompression from 'vite-plugin-compression';

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    viteCompression({ algorithm: 'gzip' }),
    viteCompression({ algorithm: 'brotliCompress', ext: '.br' })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'vendor': ['lucide-react', '@supabase/supabase-js']
        }
      },
      treeshake: true
    },
    chunkSizeWarningLimit: 1000,
    minify: 'esbuild',
    cssCodeSplit: true
  },
  server: {
    host: '0.0.0.0',  // Bind to all network interfaces
    port: 3000,        // Set the port (you can change this as needed)
    headers: {
      'Content-Security-Policy': `
        default-src 'self';
        script-src 'self' 'unsafe-inline';
        style-src 'self' 'unsafe-inline';
        img-src 'self' data: https: http:;
        connect-src 'self' ${mode === 'development' ? 'ws:' : ''} https://vsigxyrcnfwhschhtluf.supabase.co;
      `.replace(/\s+/g, ' ').trim()
    }
  },
  define: {
    'process.env': {
      REACT_ROUTER_FUTURE: JSON.stringify({
        v7_startTransition: true,
        v7_relativeSplatPath: true,
        v7_fetcherPersist: true,
        v7_normalizeFormMethod: true,
        v7_partialHydration: true,
        v7_skipActionErrorRevalidation: true
      })
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  }
}));

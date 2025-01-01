import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteCompression from 'vite-plugin-compression';

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    viteCompression({ algorithm: 'brotliCompress', ext: '.br' })
  ],
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: [
            'react',
            'react-dom',
            'react-router-dom',
            '@supabase/supabase-js',
            'lucide-react'
          ]
        }
      }
    }
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    headers: {
      'Content-Security-Policy': `
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval';
        style-src 'self' 'unsafe-inline';
        img-src 'self' data: blob: https:;
        font-src 'self';
        connect-src 'self' ${mode === 'development' ? 'ws:' : ''} https://vsigxyrcnfwhschhtluf.supabase.co;
        object-src 'none';
        base-uri 'self';
        form-action 'self';
        frame-ancestors 'none';
        block-all-mixed-content;
        upgrade-insecure-requests;
      `.replace(/\s+/g, ' ').trim()
    }
  }
}));

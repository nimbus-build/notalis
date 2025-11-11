import { defineConfig } from 'vite';
import path from 'path';

import preact from '@preact/preset-vite';
import csp from "vite-plugin-csp-guard";

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'react': 'preact/compat',
      'react-dom': 'preact/compat',
    },
  },
  build: {
    // Enable minification and tree shaking for production
    minify: 'esbuild',
    target: 'es2022',
    rollupOptions: {
      output: {
        // More granular code splitting for large libraries
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Keep feature-based chunks for big libraries
            if (id.includes('@milkdown/crepe')) return 'milkdown-crepe';
            if (id.includes('@milkdown/kit')) return 'milkdown-kit';
            if (id.includes('@milkdown/plugin-highlight')) return 'milkdown-highlight';
            if (id.includes('@milkdown/react')) return 'milkdown-react';
            if (id.includes('@uiw/codemirror')) return 'codemirror-themes';
            if (id.includes('lucide')) return 'icons';
            if (id.includes('preact')) return 'preact';
            if (id.includes('refractor')) return 'refractor';
            if (id.includes('@babel/runtime')) return 'babel-runtime';
            if (id.includes('tailwind-merge')) return 'tailwind-merge';
            if (id.includes('class-variance-authority')) return 'cva';
            if (id.includes('clsx')) return 'clsx';
            // Split remaining vendor code into two chunks by even/odd hash of path
            const hash = Array.from(id).reduce((acc, c) => acc + c.charCodeAt(0), 0);
            return hash % 2 === 0 ? 'vendor-a' : 'vendor-b';
          }
        },
        // Improve file naming for caching
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      }
    }
  },
  plugins: [
    preact(),
    csp({
      algorithm: "sha256",
      // TODO: Re-enable after fixing the bug that breaks SRI verification.
      build: { sri: false },
      dev: { run: true },
      policy: {
        'default-src': ["'self'"],
        'script-src': ["'self'"],
        'style-src': ["'self'", "unsafe-inline"],
        'style-src-elem': ["'self'", "'unsafe-inline'"],
        'font-src': ["'self'", 'data:'],
        'img-src': ["'self'", 'data:', 'https:'],
        'object-src': ["'none'"],
        'base-uri': ["'self'"],
        'form-action': ["'self'"]
      },
    })
  ],
})

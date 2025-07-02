import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const plugins = [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icon-192.png', 'icon-512.png'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
              },
            },
          },
        ],
      },
      manifest: {
        name: 'Ponto PJ - Sistema de Ponto Eletrônico',
        short_name: 'Ponto PJ',
        description:
          'Sistema de ponto eletrônico mobile-first para controle de jornada de trabalho',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#3b82f6',
        orientation: 'portrait-primary',
        scope: '/',
        lang: 'pt-BR',
        categories: ['business', 'productivity', 'utilities'],
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
        ],
      },
    }),
  ];

  return {
    plugins,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      target: 'esnext',
      minify: mode === 'analyze' ? false : 'terser',
      sourcemap: mode === 'analyze',
      cssCodeSplit: true,
      cssMinify: true,
      rollupOptions: {
        output: {
          chunkFileNames: () => {
            return `js/[name]-[hash].js`;
          },
          assetFileNames: assetInfo => {
            const info = assetInfo.name?.split('.') || [];
            const ext = info[info.length - 1];
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
              return `images/[name]-[hash][extname]`;
            }
            if (/css/i.test(ext)) {
              return `css/[name]-[hash][extname]`;
            }
            return `assets/[name]-[hash][extname]`;
          },
        },
      },
      terserOptions:
        mode === 'analyze'
          ? undefined
          : {
              compress: {
                drop_console: true,
                drop_debugger: true,
                pure_funcs: ['console.log', 'console.info', 'console.debug'],
                passes: 2,
                toplevel: true,
                unsafe: true,
                unsafe_comps: true,
              },
              mangle: {
                toplevel: true,
                safari10: true,
              },
            },
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        '@mantine/core',
        '@mantine/hooks',
        '@mantine/notifications',
        '@tabler/icons-react',
        'zustand',
        'react-router-dom',
      ],
    },
    css: {
      postcss: './postcss.config.js',
      devSourcemap: false,
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
    },
  };
});

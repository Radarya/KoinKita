import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      cssMinify: true,
      minify: 'esbuild',
      rollupOptions: {
        output: {
          manualChunks(id) {
            const normalizedId = id.replace(/\\/g, '/');
            if (normalizedId.includes('/src/curriculum/examBank')) {
              return 'curriculum-exams';
            }
            if (normalizedId.includes('/src/curriculum/semesters')) {
              return 'curriculum-data';
            }
            if (normalizedId.includes('/node_modules/')) {
              if (normalizedId.includes('/node_modules/@capacitor')) {
                return 'vendor-capacitor';
              }
              if (
                normalizedId.includes('/node_modules/firebase/') ||
                normalizedId.includes('/node_modules/@firebase/')
              ) {
                return 'vendor-firebase';
              }
              if (
                normalizedId.includes('/node_modules/motion/') ||
                normalizedId.includes('/node_modules/framer-motion/')
              ) {
                return 'vendor-motion';
              }
              if (normalizedId.includes('/node_modules/lucide-react/')) {
                return 'vendor-lucide';
              }
            }
          }
        }
      }
    }
  };
});

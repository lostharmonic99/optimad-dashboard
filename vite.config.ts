import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { componentTagger } from 'lovable-tagger';

/**
 * Vite configuration for the optimad-dashboard project.
 * @param {Object} options - Vite mode and command options.
 * @returns {Object} Vite configuration object.
 */
export default defineConfig(({ mode }) => ({
  server: {
    host: '0.0.0.0', // Bind to all interfaces (replaces "::")
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Backend URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}));
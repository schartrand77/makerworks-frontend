import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { visualizer } from 'rollup-plugin-visualizer'
import compression from 'vite-plugin-compression'
import path from 'path'

export default defineConfig({
  base: './',
  plugins: [
    react(),
    visualizer({
      open: false,
      gzipSize: true,
      brotliSize: false,
    }),
    compression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    proxy: {
      // Match your backend’s externally mapped port
      '/api': {
        target: 'http://192.168.1.170:49152', // 👈 PATCHED: correct Unraid-mapped backend port
        changeOrigin: true,
        secure: false,
        rewrite: path => path.replace(/^\/api/, '/api'),
      },
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
})
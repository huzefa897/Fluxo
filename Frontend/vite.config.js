// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  base: "./", 
  plugins: [react(), tailwindcss()],

  // Make Vite prebundle heavy deps (MUI/Emotion) so hashes stay consistent
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@mui/material',
      '@mui/icons-material',
      '@emotion/react',
      '@emotion/styled'
    ],
  },

  // Ensure a single copy of react/react-dom (prevents re-optimizing loops)
  resolve: {
    alias: {
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
    },
    dedupe: ['react', 'react-dom'],
  },

  server: {
    port: 5173,
    strictPort: true,
    hmr: { overlay: true },
  },

  // Optional: move Vite’s cache to a known spot if you switch branches a lot
  // cacheDir: 'node_modules/.vite'
})

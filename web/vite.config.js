import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: '../ui/dist',
    emptyOutDir: true,
    assetsDir: 'assets',
  },
  server: {
    port: 3000,
  },
});

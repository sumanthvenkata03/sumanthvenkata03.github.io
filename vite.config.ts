import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Apex custom domain (sumanthvenkata.com) → base '/', NOT '/repo-name/'.
export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});

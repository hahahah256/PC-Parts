
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: './index.html',
    },
  },
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
    // Allows you to set a secret admin key in Vercel settings. Defaults to '1234'.
    'process.env.ADMIN_KEY': JSON.stringify(process.env.ADMIN_KEY || '1234')
  }
});

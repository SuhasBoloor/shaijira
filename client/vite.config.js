import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/auth': 'http://localhost:3000',
      '/org': 'http://localhost:3000',
      '/project': 'http://localhost:3000',
      '/task': 'http://localhost:3000',
      '/membership': 'http://localhost:3000',
      '/admin': 'http://localhost:3000',
      '/health': 'http://localhost:3000',
    }
  }
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import mkcert from 'vite-plugin-mkcert';

export default defineConfig({
  plugins: [react(), mkcert()],
  server: {
    https: true,
    proxy: {
      '/api': {
        target: 'https://vmxmjjenz4.execute-api.eu-north-1.amazonaws.com/Prod',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/pixabay-proxy': {
        target: 'https://pixabay.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/pixabay-proxy/, ''),
      },
    },
  },
});
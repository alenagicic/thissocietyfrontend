import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'cert.pem')),
    },
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
})

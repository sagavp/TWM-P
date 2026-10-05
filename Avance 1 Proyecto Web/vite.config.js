import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@mui/icons-material': fileURLToPath(
        new URL('./node_modules/@mui/icons-material/esm', import.meta.url),
      ),
    },
  },
})

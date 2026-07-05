import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Split stable vendor libraries into their own long-term-cacheable chunks
    // so app updates don't invalidate the whole bundle.
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (/node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/.test(id)) return 'vendor-react'
          if (id.includes('framer-motion') || id.includes('motion-dom')) return 'vendor-motion'
          if (id.includes('recharts') || id.includes('d3-')) return 'vendor-charts'
          if (id.includes('lucide-react') || id.includes('swiper')) return 'vendor-ui'
          return undefined
        },
      },
    },
    chunkSizeWarningLimit: 900,
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://quesgen-ai-2.onrender.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})

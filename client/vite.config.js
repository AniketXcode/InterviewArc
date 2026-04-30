import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom', 'react-redux', '@reduxjs/toolkit'],
          motion: ['motion'],
          charts: ['recharts'],
          pdf: ['jspdf', 'jspdf-autotable'],
          interviewAudio: ['@vapi-ai/web', '@daily-co/daily-js', '@met4citizen/headtts'],
        },
      },
    },
  },
})

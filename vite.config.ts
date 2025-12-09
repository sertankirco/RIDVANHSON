import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// TypeScript'in process'i tanıması için deklarasyon
declare const process: any;

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      // API Key'i öncelikli tanımla
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY || process.env.API_KEY || ''),
      // Diğer process.env çağrıları için boş obje ata (çökmemesi için)
      'process.env': {}
    }
  }
})
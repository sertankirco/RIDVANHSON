import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // process.cwd() ESM modüllerinde bazen sorun yaratabilir, güvenli erişim sağlıyoruz.
  const cwd = (process as any).cwd ? (process as any).cwd() : '.';
  const env = loadEnv(mode, cwd, '');
  
  return {
    plugins: [react()],
    define: {
      // API_KEY'i güvenli bir şekilde string olarak gömüyoruz.
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY || process.env.API_KEY || ''),
      // Diğer kütüphanelerin 'process is not defined' hatası vermesini engelliyoruz.
      'process.env': JSON.stringify({})
    }
  }
})
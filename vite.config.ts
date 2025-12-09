import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // process.cwd() kullanımı Vercel'de bazen sorun yaratabilir,
  // loadEnv varsayılan olarak kök dizini kullanır, o yüzden cwd argümanını kaldırıyoruz.
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // API_KEY'i güvenli bir şekilde string olarak değiştiriyoruz.
      // process.env.API_KEY kod içinde geçtiğinde bu değerle değiştirilecek.
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY || process.env.API_KEY || '')
    }
  }
})
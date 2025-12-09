import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      // process.env nesnesini tamamen boş obje ({}) olarak tanımlamak
      // build sırasında Rollup hatasına neden olur. 
      // Sadece API_KEY değişkenini replace ediyoruz.
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY || process.env.API_KEY || '')
    }
  }
})
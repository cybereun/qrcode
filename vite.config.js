import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    base: './', // 상대 경로로 설정하여 GitHub Pages 배포 시 경로 문제 해결
})

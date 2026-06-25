import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true, // Báo lỗi nếu cổng 5173 đã bị dùng, không tự chuyển sang cổng khác
  },
});

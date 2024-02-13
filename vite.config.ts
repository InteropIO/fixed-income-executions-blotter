import { defineConfig } from 'vite';
import eslintPlugin from '@nabla/vite-plugin-eslint';
import path from 'path';

export default defineConfig({
  plugins: [eslintPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5553,
  },
  base: '/interopio/executions-blotter',
});

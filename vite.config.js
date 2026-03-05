import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    port: 3000,
    open: false
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        ai_assets: resolve(__dirname, 'ai-assets.html'),
        banjaro: resolve(__dirname, 'banjaro.html'),
        credflow: resolve(__dirname, 'credflow.html'),
        flight_op: resolve(__dirname, 'flight-op.html'),
        intract: resolve(__dirname, 'intract.html'),
        z42: resolve(__dirname, 'z42.html'),
        case_study_template: resolve(__dirname, 'case-study-template.html')
      }
    }
  }
});

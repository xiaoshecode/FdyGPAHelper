import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import pkg from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "gpa-helper",
  define: {
    "process.env.PACKAGE_VERSION": JSON.stringify(pkg.version),
  },
})

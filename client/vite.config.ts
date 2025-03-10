import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target:
          "https://cloudytype-git-typeboard-validations-jonels-projects-684e0f31.vercel.app/",
        changeOrigin: true,
      },
    },
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";
import path from "node:path";

// SINGLEFILE=1 inlines everything into one openable index.html (no server).
const singleFile = process.env.SINGLEFILE === "1";

// https://vite.dev/config/
export default defineConfig({
  // Base path. "/" for local dev and Capacitor; "/jarvis/app/" for GitHub
  // Pages; "./" for the single-file build so it works from file://.
  base: singleFile ? "./" : (process.env.VITE_BASE ?? "/"),
  plugins: [react(), ...(singleFile ? [viteSingleFile()] : [])],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    host: true,
    port: 5173,
    // In dev, proxy /api to the local AI backend (Milestone 2).
    proxy: {
      "/api": {
        target: "http://localhost:8787",
        changeOrigin: true,
      },
    },
  },
});

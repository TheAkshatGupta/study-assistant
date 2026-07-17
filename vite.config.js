import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Frontend runs on 5173, backend (which holds the API key) runs on 8787.
// All /api/* calls are proxied to the backend so the browser never sees the key.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8787",
        changeOrigin: true
      }
    }
  }
});

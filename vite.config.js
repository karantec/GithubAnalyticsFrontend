import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000, // matches CLIENT_URL in the backend .env
    proxy: {
      // /api/* -> Express backend (no CORS headaches in dev)
      "/api": "http://localhost:5000",
    },
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: new URL("index.html", import.meta.url).pathname,
        facturacionElectronica: new URL(
          "facturacion-electronica-colombia/index.html",
          import.meta.url
        ).pathname,
      },
    },
  },
  server: {
    port: 5175,
    open: true,
  },
});

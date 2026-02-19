import { defineConfig } from "vite";

export default defineConfig({
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "react",
  },
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

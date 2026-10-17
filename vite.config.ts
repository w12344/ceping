import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: "serve-public-html-middleware",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const rawUrl = req.url ? req.url.split("?")[0] : "";
          const targetUrl =
            rawUrl === "/admin"
              ? "/admin.html"
              : rawUrl === "/portal"
              ? "/portal.html"
              : rawUrl === "/report"
              ? "/report.html"
              : rawUrl;

          if (targetUrl.endsWith(".html") && targetUrl !== "/index.html") {
            const relPath = targetUrl.replace(/^\//, "");
            const publicFile = path.resolve(__dirname, "public", relPath);
            if (fs.existsSync(publicFile) && fs.statSync(publicFile).isFile()) {
              res.setHeader("Content-Type", "text/html; charset=utf-8");
              return res.end(fs.readFileSync(publicFile));
            }
          }
          next();
        });
      }
    }
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  server: {
    port: 9800,
    open: true
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: false
  }
});

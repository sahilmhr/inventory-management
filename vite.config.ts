import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/icon.svg", "offline.html"],
      manifest: {
        name: "Retail Pocket",
        short_name: "RetailPocket",
        description: "Offline-first retail inventory, sales, profit analytics, and employee stock sharing.",
        start_url: "/",
        scope: "/",
        display: "standalone",
        orientation: "portrait-primary",
        background_color: "#f8fafc",
        theme_color: "#0f766e",
        categories: ["business", "productivity", "finance"],
        icons: [
          {
            src: "/icons/icon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any maskable"
          }
        ],
        shortcuts: [
          {
            name: "Record sale",
            short_name: "Sale",
            description: "Record a product sale",
            url: "/sales",
            icons: [{ src: "/icons/icon.svg", sizes: "any", type: "image/svg+xml" }]
          },
          {
            name: "Inventory",
            short_name: "Stock",
            description: "Open inventory",
            url: "/inventory",
            icons: [{ src: "/icons/icon.svg", sizes: "any", type: "image/svg+xml" }]
          }
        ]
      },
      workbox: {
        navigateFallback: "/index.html",
        globPatterns: ["**/*.{js,css,html,svg,png,ico,webmanifest}"],
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === "image",
            handler: "CacheFirst",
            options: {
              cacheName: "retail-pocket-images",
              expiration: {
                maxEntries: 80,
                maxAgeSeconds: 60 * 60 * 24 * 30
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: true
      }
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalizedId = id.replace(/\\/g, "/");

          if (normalizedId.includes("/node_modules/recharts/")) {
            return "charts";
          }

          if (
            normalizedId.includes("/node_modules/react/") ||
            normalizedId.includes("/node_modules/react-dom/") ||
            normalizedId.includes("/node_modules/scheduler/")
          ) {
            return "react-vendor";
          }

          if (normalizedId.includes("/node_modules/react-router") || normalizedId.includes("/node_modules/@remix-run/router/")) {
            return "router-vendor";
          }

          if (normalizedId.includes("/node_modules/@tanstack/")) {
            return "query-vendor";
          }

          if (normalizedId.includes("/node_modules/dexie/") || normalizedId.includes("/node_modules/zustand/")) {
            return "data-vendor";
          }

          if (
            normalizedId.includes("/node_modules/react-hook-form/") ||
            normalizedId.includes("/node_modules/@hookform/") ||
            normalizedId.includes("/node_modules/zod/")
          ) {
            return "forms-vendor";
          }

          if (normalizedId.includes("/node_modules/lucide-react/")) {
            return "icons-vendor";
          }

          if (normalizedId.includes("/node_modules")) {
            return "vendor";
          }
        }
      }
    }
  },
  server: {
    port: 5173
  }
});

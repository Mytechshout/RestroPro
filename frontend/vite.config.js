import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
      },
      manifest: {
        name: "OneOs Pos",
        short_name: "OneOs Pos",
        description: "Manage Your Restaurant, Cafe, Hotel, Bar, Food Truck, Stall, any food store.",
        theme_color: "#ECF1EB",
        icons: [
          {
            src: "/one-pos-icon.svg",
            sizes: "any",
            type: "image/svg+xml",
          },
          {
            src: "/one-pos-icon.svg",
            sizes: "any",
            type: "image/svg+xml",
          },
        ],
      },
    }),
  ],
});

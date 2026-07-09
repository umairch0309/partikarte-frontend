import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const manifestForPlugin = {
  registerType: "prompt",
  includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
  manifest: {
    name: "Partikarte",
    short_name: "Partikarte",
    description: "Explore the Night",
    icons: [
      {
        src: "/logo.svg",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/logo.svg",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/logo.svg",
        sizes: "180x180",
        type: "image/png",
        purpose: "apple touch icon",
      },
      {
        src: "/logo.svg",
        sizes: "225x225",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
    theme_color: "#171717",
    background_color: "#e8ebf2",
    display: "standalone",
    scope: "/",
    start_url: "/",
    orientation: "portrait",
  },
};
// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  resolve: {
    alias: [
      {
        find: /^react-slick$/,
        replacement: path.resolve(__dirname, "src/lib/slider.jsx"),
      },
    ],
  },
  plugins: [react(), VitePWA(manifestForPlugin)],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString();
          }
        },
      },
    },
  },
});

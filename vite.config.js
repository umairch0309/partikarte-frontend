import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { createDevApiPlugin } from "./api/_lib/router.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const manifestForPlugin = {
  registerType: "autoUpdate",
  workbox: {
    cleanupOutdatedCaches: true,
    skipWaiting: true,
    clientsClaim: true,
  },
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
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    base: "/",
    resolve: {
      alias: [
        {
          find: /^react-slick$/,
          replacement: path.resolve(__dirname, "src/lib/slider.jsx"),
        },
      ],
    },
    css: {
      preprocessorOptions: {
        scss: {
          silenceDeprecations: ["import", "global-builtin", "slash-div"],
        },
      },
    },
    plugins: [react(), createDevApiPlugin(env), VitePWA(manifestForPlugin)],
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
  };
});


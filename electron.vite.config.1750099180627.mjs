// electron.vite.config.mjs
import { resolve } from "path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
var __electron_vite_injected_dirname = "/media/goiaba07/Data/Desenvolvimento/VaporClient";
var electron_vite_config_default = defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    entry: "src/main/index.mjs"
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    input: {
      preload: path.resolve(__electron_vite_injected_dirname, "src/preload/index.js")
    },
    vitePlugins: [],
    vite: {
      build: {
        rollupOptions: {
          external: ["webtorrent"]
        }
      }
    }
  },
  renderer: {
    resolve: {
      alias: {
        "@renderer": resolve("src/renderer/src")
      }
    },
    plugins: [react(), tailwindcss()]
  }
});
export {
  electron_vite_config_default as default
};

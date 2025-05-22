import { resolve } from "path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from 'path';

export default defineConfig({
    main: {
        plugins: [externalizeDepsPlugin()],
        entry: 'src/main/index.mjs',
    },
    preload: {
        plugins: [externalizeDepsPlugin()],
        input: {
            preload: path.resolve(__dirname, 'src/preload/index.js'),
          },
          vitePlugins: [],
          vite: {
            build: {
              rollupOptions: {
                external: ['webtorrent'],
              },
            },
          },
    },
    renderer: {
        resolve: {
            alias: {
                "@renderer": resolve("src/renderer/src"),
            },
        },
        plugins: [react(), tailwindcss()],
    },
});

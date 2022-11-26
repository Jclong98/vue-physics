import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Unocss from "unocss/vite";
import { presetUno, presetIcons } from "unocss";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  plugins: [
    vue(),
    AutoImport({
      imports: ["vue", "@vueuse/core"],
      dts: "./src/auto-imports.d.ts",
    }),
    Unocss({
      presets: [presetUno(), presetIcons()],
    }),
  ],
});

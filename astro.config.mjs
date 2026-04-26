// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

const base = "/2026";

// https://astro.build/config
export default defineConfig({
  site: "https://sitcon.camp",
  base,

  vite: {
    plugins: [tailwindcss()],
  },
});

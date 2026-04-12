// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import favicons from "astro-favicons";

import partytown from "@astrojs/partytown";

const base = "/2026";

// https://astro.build/config
export default defineConfig({
  site: "https://sitcon.camp",
  base,

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    favicons({
      name: "SITCON Camp 2026",
      short_name: "SITCON Camp",
      output: {
        images: true,
        files: true,
        html: true,
        assetsPrefix: base,
      },
    }),
    partytown(),
  ],
});

// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import Icons from "unplugin-icons/vite";

import tailwindcss from "@tailwindcss/vite";

const base = "/2026";

// https://astro.build/config
export default defineConfig({
	site: "https://sitcon.camp",
	base,

	fonts: [
		{
			provider: fontProviders.local(),
			name: "LINE Seed TW",
			cssVariable: "--font-line-seed-tw",
			weights: [250, 400, 700, 800],
			styles: ["normal"],
			options: {
				variants: [
					{
						weight: 250,
						style: "normal",
						src: ["./src/assets/fonts/LINESeedTW_OTF_Th.woff2"]
					},
					{
						weight: 400,
						style: "normal",
						src: ["./src/assets/fonts/LINESeedTW_OTF_Rg.woff2"]
					},
					{
						weight: 700,
						style: "normal",
						src: ["./src/assets/fonts/LINESeedTW_OTF_Bd.woff2"]
					},
					{
						weight: 800,
						style: "normal",
						src: ["./src/assets/fonts/LINESeedTW_OTF_Eb.woff2"]
					}
				]
			}
		}
	],
	vite: {
		plugins: [
			tailwindcss(),
			Icons({
				compiler: "astro"
			})
		]
	}
});

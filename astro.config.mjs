// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import Icons from "unplugin-icons/vite";

import tailwindcss from "@tailwindcss/vite";

import sitemap from "@astrojs/sitemap";

import favicons from "astro-favicons";

const base = "/2026";
const basePath = base.replace(/^\/+|\/+$/g, "");
const faviconAssetNames = new Set([
	"apple-touch-icon-precomposed.png",
	"apple-touch-icon.png",
	"favicon-16x16.png",
	"favicon-32x32.png",
	"favicon-48x48.png",
	"favicon.ico",
	"favicon.svg",
	"safari-pinned-tab.svg"
]);

function emitFaviconAssetsAtArtifactRoot() {
	return {
		name: "camp:favicon-assets-at-artifact-root",
		enforce: /** @type {"post"} */ ("post"),
		/**
		 * @param {unknown} _
		 * @param {Record<string, { fileName: string }>} bundle
		 */
		generateBundle(_, bundle) {
			for (const [fileName, asset] of Object.entries(bundle)) {
				const faviconAssetName = fileName.startsWith(`${basePath}/`) ? fileName.slice(basePath.length + 1) : "";

				if (!faviconAssetNames.has(faviconAssetName)) {
					continue;
				}

				asset.fileName = faviconAssetName;
				bundle[faviconAssetName] = asset;
				delete bundle[fileName];
			}
		}
	};
}

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
		},
		{
			provider: fontProviders.local(),
			name: "Fira Mono",
			cssVariable: "--font-mono",
			weights: [400, 500, 700],
			styles: ["normal"],
			options: {
				variants: [
					{
						weight: 400,
						style: "normal",
						src: ["./src/assets/fonts/FiraMono-Regular.woff2"]
					},
					{
						weight: 500,
						style: "normal",
						src: ["./src/assets/fonts/FiraMono-Medium.woff2"]
					},
					{
						weight: 700,
						style: "normal",
						src: ["./src/assets/fonts/FiraMono-Bold.woff2"]
					}
				]
			}
		}
	],

	vite: {
		preview: {
			allowedHosts: ["fake.sitcon.party"]
		},
		plugins: [
			tailwindcss(),
			Icons({
				compiler: "astro"
			}),
			emitFaviconAssetsAtArtifactRoot()
		]
	},

	integrations: [
		sitemap(),
		favicons({
			name: "SITCON Camp 2026",
			short_name: "SITCON Camp",
			icons: {
				android: false,
				appleIcon: ["apple-touch-icon.png", "apple-touch-icon-precomposed.png", "safari-pinned-tab.svg"],
				appleStartup: false,
				favicons: true,
				windows: false,
				yandex: false
			},
			output: {
				images: true,
				files: false,
				html: false,
				assetsPrefix: base
			}
		})
	]
});

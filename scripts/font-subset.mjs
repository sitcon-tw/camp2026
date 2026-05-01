import { existsSync } from "node:fs";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { basename, extname, join } from "node:path";

const require = createRequire(import.meta.url);
const subsetFont = require("subset-font");

// Config
const DIST_DIR = "./dist";
const SOURCE_DIRS = ["./src/data", "./src/pages", "./src/components", "./src/layouts"];
const SOURCE_EXTS = new Set([".astro", ".md", ".mdx", ".json"]);

const BASE_CHARS = ` !"#$%&'()*+,-./0123456789:;<=>?@` + `ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_\`` + `abcdefghijklmnopqrstuvwxyz{|}~` + `，。！？；：「」『』（）【】〔〕…—－～·、　`;

// Char collection
function extractText(content, ext) {
	let text = content;
	if (ext === ".astro") {
		text = text.replace(/^---[\s\S]*?---/m, "");
		text = text.replace(/<script[\s\S]*?<\/script>/gi, "");
		text = text.replace(/<style[\s\S]*?<\/style>/gi, "");
		text = text.replace(/<[^>]+>/g, "").replace(/\{[^}]*\}/g, "");
	} else if (ext === ".md" || ext === ".mdx") {
		text = text.replace(/^---[\s\S]*?---/m, "");
		text = text.replace(/```[\s\S]*?```/g, "");
		text = text.replace(/`[^`]+`/g, "");
		text = text.replace(/[#*_~\[\]()>|]/g, " ");
	} else if (ext === ".json") {
		// strip JSON structural chars {}[]",: and ASCII-only field names
		text = text.replace(/[{}\[\]:,]/g, "");
		text = text.replace(/"\w+":/g, "");
		text = text.replace(/\\(.)/g, "$1");
	}
	return text;
}

async function collectChars() {
	const chars = new Set(BASE_CHARS.split(""));
	let fileCount = 0;

	for (const dir of SOURCE_DIRS) {
		if (!existsSync(dir)) continue;
		const entries = await readdir(dir, { recursive: true });
		await Promise.all(
			entries
				.filter(f => SOURCE_EXTS.has(extname(String(f))))
				.map(async file => {
					const ext = extname(String(file));
					const content = await readFile(join(dir, String(file)), "utf-8");
					for (const char of extractText(content, ext)) chars.add(char);
					fileCount++;
				})
		);
	}

	const filtered = [...chars].filter(c => {
		const cp = c.codePointAt(0);
		return cp >= 0x20 && cp !== 0x7f;
	});

	console.log(`  Scanned ${fileCount} files → ${filtered.length} unique chars`);
	return filtered.join("");
}

// Scan dist/ for font files
async function findFontFilesInDist(distDir) {
	if (!existsSync(distDir)) throw new Error(`dist/ not found: ${distDir}`);

	const entries = await readdir(distDir, { recursive: true });
	const fontExtRe = /\.(woff2?|ttf|otf)$/i;

	const fontPaths = entries.filter(f => fontExtRe.test(extname(String(f)))).map(f => join(distDir, String(f)));

	return fontPaths;
}

// Subset fonts in dist/
async function subsetFontFile(fontPath, chars) {
	if (!existsSync(fontPath)) {
		console.warn(`  ⚠ Not found (skip): ${fontPath}`);
		return;
	}

	const inputBuffer = await readFile(fontPath);
	const outputBuffer = await subsetFont(inputBuffer, chars, {
		targetFormat: "woff2"
	});

	await writeFile(fontPath, outputBuffer);

	const before = (inputBuffer.byteLength / 1024).toFixed(1);
	const after = (outputBuffer.byteLength / 1024).toFixed(1);
	const saved = (100 - (outputBuffer.byteLength / inputBuffer.byteLength) * 100).toFixed(1);
	console.log(`  ✓ ${basename(fontPath).padEnd(36)} ${before.padStart(7)}KB → ${after.padStart(7)}KB  (-${saved}%)`);
}

// Main
async function main() {
	console.log("⚙  [1/3] Collecting characters from src/...");
	const chars = await collectChars();

	console.log("\n⚙  [2/3] Locating font files in dist/...");
	const fontPaths = await findFontFilesInDist(DIST_DIR);

	if (fontPaths.length === 0) {
		console.warn("  ⚠ No font files found in dist/. Check your Astro Fonts config.");
		process.exit(1);
	}
	console.log(`  Found ${fontPaths.length} font file(s)`);

	console.log("\n⚙  [3/3] Subsetting...\n");
	await Promise.all(fontPaths.map(p => subsetFontFile(p, chars)));

	console.log("\n✓ Done.");
}

main().catch(e => {
	console.error("✗", e.message);
	process.exit(1);
});

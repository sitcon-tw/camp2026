import { existsSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { basename, extname, join } from "node:path";

import { parseScheduleSheetValues, ScheduleValidationError } from "../src/lib/schedule.ts";
import { fetchScheduleSheetValues } from "./schedule-sheet.mjs";

const ASSET_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

async function collectAssetKeys(dirs) {
	const keys = new Set();

	for (const dir of dirs) {
		if (!existsSync(dir)) continue;

		const entries = await readdir(dir, { withFileTypes: true });
		for (const entry of entries) {
			const path = join(dir, entry.name);
			if (entry.isDirectory()) {
				for (const key of await collectAssetKeys([path])) keys.add(key);
				continue;
			}
			const ext = extname(entry.name).toLowerCase();
			if (entry.isFile() && ASSET_EXTENSIONS.has(ext)) {
				keys.add(basename(entry.name, ext));
			}
		}
	}

	return keys;
}

try {
	const [values, imageKeys, avatarKeys] = await Promise.all([
		fetchScheduleSheetValues(),
		collectAssetKeys(["src/assets/schedule"]),
		collectAssetKeys(["src/assets/speakers", "src/assets/feature-members"])
	]);

	const schedule = parseScheduleSheetValues(values, { imageKeys, avatarKeys });
	console.log(`✓ Schedule sheet is valid: ${schedule.sessions.length} sessions, ${schedule.speakers.length} speakers, ${schedule.session_types.length} session types`);
} catch (error) {
	console.error("✗ Schedule sheet validation failed");

	if (error instanceof ScheduleValidationError) {
		for (const issue of error.issues) {
			console.error(`  - ${issue}`);
		}
	} else {
		console.error(error instanceof Error ? error.message : String(error));
	}

	process.exit(1);
}

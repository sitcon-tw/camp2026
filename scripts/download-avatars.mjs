import { createWriteStream, mkdirSync } from "fs";
import { writeFile } from "fs/promises";
import { dirname, join } from "path";
import { pipeline } from "stream/promises";
import { fileURLToPath } from "url";
import aboutData from "../src/data/about.json" with { type: "json" };
import teams from "../src/data/teams.json" with { type: "json" };

// Download avatars

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUTPUT_DIR = join(ROOT, "src", "assets", "about", "teams");
const SIZE = 200;

const uniqueIds = [...new Set(teams.map(m => m.id))];

mkdirSync(OUTPUT_DIR, { recursive: true });

let downloaded = 0;

await Promise.all(
	uniqueIds.map(async id => {
		const dest = join(OUTPUT_DIR, `${id}.jpg`);
		const url = `https://www.gravatar.com/avatar/${id}?s=${SIZE}&d=identicon`;
		const res = await fetch(url);
		if (!res.ok) throw new Error(`Failed to fetch avatar for ${id}: ${res.status}`);
		await pipeline(res.body, createWriteStream(dest));
		downloaded++;
	})
);

const teamSection = aboutData.team.groups;
const teamDescription = await fetch("https://sitcon-camp-api-tw-fury-2.nightfury.tw/api/teams").then(res => res.json());

for (const team of teamSection) {
	const workers = teams.filter(d => d.group === team.name);

	team.members = workers.map(w => ({
		name: w.name,
		description: teamDescription.find(t => t.name === w.name)?.description || aboutData.team.modal.descriptionPlaceholder,
		job: w.role,
		avatarPath: `/assets/about/teams/${w.id}.jpg`,
		avatarLink: teamDescription.find(t => t.name === w.name)?.link || ""
	}));
}

const ABOUT_JSON = join(ROOT, "src", "data", "about.json");
await writeFile(ABOUT_JSON, JSON.stringify(aboutData, null, "\t"), "utf-8");

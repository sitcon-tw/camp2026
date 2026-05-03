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
const OUTPUT_DIR = join(ROOT, "src", "assets", "team-avatars");
const SIZE = 200;

const slugify = value => {
	const slug = String(value)
		.normalize("NFKD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^a-zA-Z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.toLowerCase();

	return slug || "member";
};

const getAvatarFilename = member => `team-avatar-${slugify(member.name)}-${member.id.slice(0, 8)}.jpg`;
const uniqueMembers = [...new Map(teams.map(member => [member.id, member])).values()];

mkdirSync(OUTPUT_DIR, { recursive: true });

let downloaded = 0;

await Promise.all(
	uniqueMembers.map(async member => {
		const dest = join(OUTPUT_DIR, getAvatarFilename(member));
		const url = `https://www.gravatar.com/avatar/${member.id}?s=${SIZE}&d=identicon`;
		const res = await fetch(url);
		if (!res.ok) throw new Error(`Failed to fetch avatar for ${member.id}: ${res.status}`);
		await pipeline(res.body, createWriteStream(dest));
		downloaded++;
	})
);

const teamSection = aboutData.team.groups;
const existingMembers = new Map();

for (const team of teamSection) {
	for (const member of team.members) {
		existingMembers.set(`${team.name}\u0000${member.name}`, member);
	}
}

for (const team of teamSection) {
	const workers = teams.filter(d => d.group === team.name);

	team.members = workers.map(w => {
		const existing = existingMembers.get(`${team.name}\u0000${w.name}`);

		return {
			name: w.name,
			description: existing?.description ?? aboutData.team.modal.descriptionPlaceholder,
			job: w.role,
			avatarPath: `/assets/team-avatars/${getAvatarFilename(w)}`,
			avatarLink: existing?.avatarLink ?? ""
		};
	});
}

const ABOUT_JSON = join(ROOT, "src", "data", "about.json");
await writeFile(ABOUT_JSON, JSON.stringify(aboutData, null, "\t"), "utf-8");

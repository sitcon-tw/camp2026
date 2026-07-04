import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const spreadsheetId = "15pM9usBziCsqUDLlSwCbpd5Bqao6vo_TzMwgGJDb2FQ";
const sheetNames = ["Session", "Speaker", "SessionType", "Room", "Tag"];
const outputFile = fileURLToPath(new URL("../src/data/generated/schedule.json", import.meta.url));

const nullCoalesce = value => (value == null ? "" : value);
const trimValue = value => nullCoalesce(value).trim();

const parseCsv = csv => {
	const rows = [];
	let row = [];
	let cell = "";
	let inQuotes = false;

	for (let index = 0; index < csv.length; index += 1) {
		const char = csv[index];
		const nextChar = csv[index + 1];

		if (char === '"') {
			if (inQuotes && nextChar === '"') {
				cell += '"';
				index += 1;
			} else {
				inQuotes = !inQuotes;
			}
			continue;
		}

		if (char === "," && !inQuotes) {
			row.push(cell);
			cell = "";
			continue;
		}

		if ((char === "\n" || char === "\r") && !inQuotes) {
			if (char === "\r" && nextChar === "\n") {
				index += 1;
			}
			row.push(cell);
			rows.push(row);
			row = [];
			cell = "";
			continue;
		}

		cell += char;
	}

	row.push(cell);
	rows.push(row);

	return rows.filter(entries => entries.some(entry => entry.trim()));
};

const rowToObject = (headers, values) => Object.fromEntries(headers.map((header, index) => [header, trimValue(values[index])]).filter(([header]) => header));

const fetchSheetRows = async sheetName => {
	const url = new URL(`https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq`);
	url.searchParams.set("tqx", "out:csv");
	url.searchParams.set("sheet", sheetName);

	const response = await fetch(url);
	const body = await response.text();

	if (!response.ok) {
		throw new Error(`Failed to fetch ${sheetName}: ${response.status} ${response.statusText || "Unauthorized"}. Publish the sheet or make it accessible by link.`);
	}

	if (/^\s*</.test(body) || body.includes("ServiceLogin") || body.includes("登入您的 Google 帳戶")) {
		throw new Error(`Failed to fetch ${sheetName}: Google returned an HTML login page. Publish the sheet or make it accessible by link.`);
	}

	const [headers = [], ...rows] = parseCsv(body);
	return rows.map(row => rowToObject(headers.map(trimValue), row)).filter(row => Object.values(row).some(value => String(value).trim()));
};

const splitList = value =>
	trimValue(value)
		.split(",")
		.map(entry => entry.trim())
		.filter(Boolean);

const pullNumberedValues = (row, prefix, maxCount) => {
	const values = [];

	for (let index = 1; index <= maxCount; index += 1) {
		const idValue = trimValue(row[`${prefix}${index}id`]);
		const value = trimValue(row[`${prefix}${index}`]);
		const entry = idValue || value;

		if (entry) {
			values.push(entry);
		}

		delete row[`${prefix}${index}id`];
		delete row[`${prefix}${index}`];
	}

	return values;
};

const localize = (row, fieldName) => ({
	zh: {
		[fieldName]: trimValue(row[`${fieldName}_zh`]),
		description: trimValue(row.description_zh)
	},
	en: {
		[fieldName]: trimValue(row[`${fieldName}_en`]),
		description: trimValue(row.description_en)
	}
});

const normalizeSession = sourceRow => {
	const row = { ...sourceRow };
	const speakers = pullNumberedValues(row, "speaker", 8);
	const tags = pullNumberedValues(row, "tag", 5);
	const session = {
		...row,
		id: trimValue(row.id),
		type: trimValue(row.type || row.session_type || row.sessionType),
		room: trimValue(row.room),
		start: trimValue(row.start),
		end: trimValue(row.end),
		zh: {
			title: trimValue(row.title_zh),
			description: trimValue(row.description_zh)
		},
		en: {
			title: trimValue(row.title_en),
			description: trimValue(row.description_en)
		},
		speakers,
		tags
	};

	if (trimValue(row.broadcast)) {
		session.broadcast = splitList(row.broadcast);
	}

	for (const key of ["title_zh", "description_zh", "title_en", "description_en", "speaker", "broadcast", "tag"]) {
		delete session[key];
	}

	return session;
};

const isSessionInstructionRow = row => trimValue(row.id).includes("UUID") || trimValue(row.start) === "議程開始時間" || trimValue(row.end) === "議程結束時間";

const normalizeSpeaker = sourceRow => {
	const row = { ...sourceRow };
	const speaker = {
		...row,
		id: trimValue(row.id),
		avatar: trimValue(row.avatar),
		zh: {
			name: trimValue(row.name_zh),
			bio: trimValue(row.bio_zh)
		},
		en: {
			name: trimValue(row.name_en),
			bio: trimValue(row.bio_en)
		}
	};

	for (const key of ["name_zh", "bio_zh", "name_en", "bio_en"]) {
		delete speaker[key];
	}

	return speaker;
};

const normalizeNamedRow = fieldName => sourceRow => {
	const row = { ...sourceRow };
	const normalized = {
		...row,
		id: trimValue(row.id),
		...localize(row, fieldName)
	};

	for (const key of [`${fieldName}_zh`, "description_zh", `${fieldName}_en`, "description_en"]) {
		delete normalized[key];
	}

	return normalized;
};

const validateSchedule = schedule => {
	const errors = [];
	const requiredFields = ["id", "type", "room", "start", "end"];

	schedule.sessions.forEach((session, index) => {
		for (const field of requiredFields) {
			if (!trimValue(session[field])) {
				errors.push(`Session row ${index + 2} is missing required field "${field}".`);
			}
		}

		if (!session.zh.title && !session.en.title) {
			errors.push(`Session "${session.id || `row ${index + 2}`}" is missing title_zh/title_en.`);
		}
	});

	if (errors.length > 0) {
		throw new Error(`Schedule validation failed:\n${errors.join("\n")}`);
	}
};

const main = async () => {
	const [sessions, speakers, sessionTypes, rooms, tags] = await Promise.all(sheetNames.map(fetchSheetRows));
	const schedule = {
		sessions: sessions.filter(row => !isSessionInstructionRow(row)).map(normalizeSession),
		speakers: speakers.map(normalizeSpeaker),
		session_types: sessionTypes.map(normalizeNamedRow("name")),
		rooms: rooms.map(normalizeNamedRow("name")),
		tags: tags.map(normalizeNamedRow("name"))
	};

	validateSchedule(schedule);

	await mkdir(dirname(outputFile), { recursive: true });
	await writeFile(outputFile, `${JSON.stringify(schedule, null, "\t")}\n`, "utf8");
	console.log(`Wrote ${outputFile}`);
};

main().catch(error => {
	console.error(error instanceof Error ? error.message : error);
	process.exitCode = 1;
});

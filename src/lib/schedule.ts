export const SCHEDULE_SPREADSHEET_ID = "1gYc0nbbDmxtDiHXurV8bIAZZq30Ev0ADc4Ew44YzZ3g";
export const SCHEDULE_CACHE_TTL_MS = 2 * 60 * 1000;

export const SCHEDULE_SHEET_NAMES = {
	meta: "Meta",
	slots: "Slots",
	days: "Days",
	blocks: "Blocks",
	events: "Events",
	categories: "Categories",
	speakers: "Speakers"
} as const;

export const SCHEDULE_SHEET_RANGES = {
	[SCHEDULE_SHEET_NAMES.meta]: "A1:B",
	[SCHEDULE_SHEET_NAMES.slots]: "A1:B",
	[SCHEDULE_SHEET_NAMES.days]: "A1:F",
	[SCHEDULE_SHEET_NAMES.blocks]: "A1:D",
	[SCHEDULE_SHEET_NAMES.events]: "A1:I",
	[SCHEDULE_SHEET_NAMES.categories]: "A1:D",
	[SCHEDULE_SHEET_NAMES.speakers]: "A1:E"
} as const;

export const SCHEDULE_REQUIRED_HEADERS = {
	[SCHEDULE_SHEET_NAMES.meta]: ["key", "value"],
	[SCHEDULE_SHEET_NAMES.slots]: ["order", "slot"],
	[SCHEDULE_SHEET_NAMES.days]: ["order", "id", "title", "date", "subtitle", "type"],
	[SCHEDULE_SHEET_NAMES.blocks]: ["day_id", "start_slot", "span", "event_id"],
	[SCHEDULE_SHEET_NAMES.events]: ["id", "name", "summary", "category_id", "is_interactive", "description", "image_key", "image_alt", "speaker_ids"],
	[SCHEDULE_SHEET_NAMES.categories]: ["order", "id", "label", "theme"],
	[SCHEDULE_SHEET_NAMES.speakers]: ["id", "name", "description", "avatar_key", "avatar_alt"]
} as const;

export const SCHEDULE_DAY_TYPES = ["opening", "software", "artificial-intelligence", "security", "closing"] as const;
export const SCHEDULE_CATEGORY_THEMES = ["green", "blue", "orange", "sky", "lavender", "dark"] as const;

export type ScheduleSheetName = (typeof SCHEDULE_SHEET_NAMES)[keyof typeof SCHEDULE_SHEET_NAMES];
export type ScheduleDayType = (typeof SCHEDULE_DAY_TYPES)[number];
export type ScheduleCategoryTheme = (typeof SCHEDULE_CATEGORY_THEMES)[number];
export type ScheduleCellValue = string | number | boolean | null | undefined;
export type ScheduleSheetValues = Partial<Record<ScheduleSheetName, ScheduleCellValue[][]>>;

export interface ScheduleMeta {
	title: string;
	description: string;
	note?: string;
}

export interface ScheduleBlock {
	startSlot: string;
	span: number;
	eventId: string;
}

export interface ScheduleSpeaker {
	id: string;
	name?: string;
	description?: string;
	avatar?: {
		key: string;
		alt?: string;
	};
}

export interface ScheduleCategory {
	id: string;
	label: string;
	theme: ScheduleCategoryTheme;
}

export interface ScheduleDay {
	id: string;
	title: string[];
	date: string;
	subtitle: string;
	type: ScheduleDayType;
	blocks: ScheduleBlock[];
}

export interface ScheduleEvent {
	id: string;
	name: string;
	summary: string;
	categoryId: string;
	isInteractive: boolean;
	description?: string[];
	image?: {
		key: string;
		alt?: string;
	};
	speakers?: ScheduleSpeaker["id"][];
}

export interface ScheduleData {
	meta: ScheduleMeta;
	slots: string[];
	days: ScheduleDay[];
	events: ScheduleEvent[];
	categories: ScheduleCategory[];
	speakers: ScheduleSpeaker[];
}

export interface ScheduleValidationOptions {
	imageKeys?: ReadonlySet<string>;
	avatarKeys?: ReadonlySet<string>;
}

export interface GoogleVisualizationResponse {
	status: string;
	errors?: {
		reason?: string;
		message?: string;
		detailed_message?: string;
	}[];
	table?: {
		rows?: {
			c?: ({ v?: unknown; f?: string | null } | null)[];
		}[];
		cols?: {
			label?: string;
		}[];
		parsedNumHeaders?: number;
	};
}

export class ScheduleValidationError extends Error {
	issues: string[];

	constructor(issues: string[]) {
		super(issues.join("\n"));
		this.name = "ScheduleValidationError";
		this.issues = issues;
	}
}

const sheetOrder = Object.values(SCHEDULE_SHEET_NAMES);
const dayTypeSet = new Set<string>(SCHEDULE_DAY_TYPES);
const categoryThemeSet = new Set<string>(SCHEDULE_CATEGORY_THEMES);

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);

const cellToText = (value: ScheduleCellValue): string => {
	if (value === null || value === undefined) return "";
	if (typeof value === "boolean") return value ? "TRUE" : "FALSE";
	return String(value).trim();
};

const splitLines = (value: string): string[] => value.replace(/\r\n?/g, "\n").split("\n");

const splitFilledLines = (value: string): string[] =>
	splitLines(value)
		.map(line => line.trim())
		.filter(Boolean);

const splitIds = (value: string): string[] =>
	value
		.split(/[,\n]/)
		.map(id => id.trim())
		.filter(Boolean);

const parseBoolean = (value: string): boolean | null => {
	const normalized = value.trim().toLowerCase();
	if (["true", "yes", "y", "1"].includes(normalized)) return true;
	if (["false", "no", "n", "0", ""].includes(normalized)) return false;
	return null;
};

const parsePositiveInteger = (value: string): number | null => {
	if (!/^\d+$/.test(value.trim())) return null;
	const parsed = Number(value);
	return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
};

const getRequiredHeaders = (sheetName: ScheduleSheetName): string[] => [...SCHEDULE_REQUIRED_HEADERS[sheetName]];

const normalizeRows = (rows: ScheduleCellValue[][] | undefined): string[][] => {
	if (!rows) return [];

	return rows.map(row => row.map(cellToText)).filter(row => row.some(cell => cell.length > 0));
};

const readTable = (values: ScheduleSheetValues, sheetName: ScheduleSheetName, issues: string[]): string[][] => {
	const rows = normalizeRows(values[sheetName]);
	const requiredHeaders = getRequiredHeaders(sheetName);

	if (rows.length === 0) {
		issues.push(`${sheetName}: missing required tab or empty range`);
		return [];
	}

	const header = rows[0] ?? [];
	const hasInvalidHeader = requiredHeaders.some((column, index) => header[index] !== column);
	if (hasInvalidHeader) {
		issues.push(`${sheetName}: expected headers ${requiredHeaders.join(", ")}`);
		return [];
	}

	return rows.slice(1).map(row => requiredHeaders.map((_, index) => row[index] ?? ""));
};

const checkDuplicate = (label: string, id: string, seen: Set<string>, issues: string[]) => {
	if (!id) return;
	if (seen.has(id)) {
		issues.push(`${label}: duplicate id "${id}"`);
		return;
	}
	seen.add(id);
};

const isScheduleDayType = (value: string): value is ScheduleDayType => dayTypeSet.has(value);
const isScheduleCategoryTheme = (value: string): value is ScheduleCategoryTheme => categoryThemeSet.has(value);

export const extractGoogleVisualizationJson = (source: string): GoogleVisualizationResponse => {
	const start = source.indexOf("(");
	const end = source.lastIndexOf(")");

	if (start === -1 || end === -1 || end <= start) {
		throw new Error("Invalid Google Visualization response");
	}

	return JSON.parse(source.slice(start + 1, end)) as GoogleVisualizationResponse;
};

export const googleVisualizationResponseToValues = (response: GoogleVisualizationResponse): string[][] => {
	if (response.status !== "ok") {
		const message =
			response.errors
				?.map(error => error.detailed_message ?? error.message ?? error.reason)
				.filter(Boolean)
				.join("; ") || "Google Visualization query failed";
		throw new Error(message);
	}

	const rows =
		response.table?.rows?.map(row =>
			(row.c ?? []).map(cell => {
				if (!cell) return "";
				if (cell.f !== undefined && cell.f !== null) return cell.f;
				return cellToText(cell.v as ScheduleCellValue);
			})
		) ?? [];

	if ((response.table?.parsedNumHeaders ?? 0) > 0) {
		return [(response.table?.cols ?? []).map(column => column.label ?? ""), ...rows];
	}

	return rows;
};

export const parseScheduleSheetValues = (values: ScheduleSheetValues, options: ScheduleValidationOptions = {}): ScheduleData => {
	const issues: string[] = [];
	const metaRows = readTable(values, SCHEDULE_SHEET_NAMES.meta, issues);
	const slotRows = readTable(values, SCHEDULE_SHEET_NAMES.slots, issues);
	const dayRows = readTable(values, SCHEDULE_SHEET_NAMES.days, issues);
	const blockRows = readTable(values, SCHEDULE_SHEET_NAMES.blocks, issues);
	const eventRows = readTable(values, SCHEDULE_SHEET_NAMES.events, issues);
	const categoryRows = readTable(values, SCHEDULE_SHEET_NAMES.categories, issues);
	const speakerRows = readTable(values, SCHEDULE_SHEET_NAMES.speakers, issues);

	const metaMap = new Map(metaRows.map(([key, value]) => [key, value]));
	const meta: ScheduleMeta = {
		title: metaMap.get("title") ?? "",
		description: metaMap.get("description") ?? ""
	};
	const note = metaMap.get("note")?.trim();
	if (note) meta.note = note;

	const slots = slotRows
		.map(([order, slot], index) => ({ order: parsePositiveInteger(order) ?? index + 1, slot }))
		.sort((left, right) => left.order - right.order)
		.map(row => row.slot)
		.filter(Boolean);

	const speakers = speakerRows.map(([id, name, description, avatarKey, avatarAlt]) => {
		const speaker: ScheduleSpeaker = { id };
		if (name) speaker.name = name;
		if (description) speaker.description = description;
		if (avatarKey) speaker.avatar = { key: avatarKey, alt: avatarAlt || undefined };
		return speaker;
	});

	const categories = categoryRows
		.map(([order, id, label, theme], index) => ({
			order: parsePositiveInteger(order) ?? index + 1,
			category: {
				id,
				label,
				theme: isScheduleCategoryTheme(theme) ? theme : (theme as ScheduleCategoryTheme)
			}
		}))
		.sort((left, right) => left.order - right.order)
		.map(row => row.category);

	const events = eventRows.map(([id, name, summary, categoryId, isInteractive, description, imageKey, imageAlt, speakerIds]) => {
		const parsedInteractive = parseBoolean(isInteractive);
		const event: ScheduleEvent = {
			id,
			name,
			summary,
			categoryId,
			isInteractive: parsedInteractive ?? false
		};
		if (description) event.description = splitLines(description);
		if (imageKey) event.image = { key: imageKey, alt: imageAlt || undefined };
		const speakers = splitIds(speakerIds);
		if (speakers.length > 0) event.speakers = speakers;
		return event;
	});

	const blocksByDay = new Map<string, ScheduleBlock[]>();
	blockRows.forEach(([dayId, startSlot, spanValue, eventId], index) => {
		const span = parsePositiveInteger(spanValue);
		if (span === null) {
			issues.push(`${SCHEDULE_SHEET_NAMES.blocks}: row ${index + 2} has invalid span "${spanValue}"`);
		}
		const blocks = blocksByDay.get(dayId) ?? [];
		blocks.push({ startSlot, span: span ?? 1, eventId });
		blocksByDay.set(dayId, blocks);
	});

	const days = dayRows
		.map(([order, id, title, date, subtitle, type], index) => ({
			order: parsePositiveInteger(order) ?? index + 1,
			day: {
				id,
				title: splitFilledLines(title),
				date,
				subtitle,
				type: isScheduleDayType(type) ? type : (type as ScheduleDayType),
				blocks: blocksByDay.get(id) ?? []
			}
		}))
		.sort((left, right) => left.order - right.order)
		.map(row => row.day);

	const data = { meta, slots, days, events, categories, speakers };
	issues.push(...validateScheduleData(data, options));

	if (issues.length > 0) {
		throw new ScheduleValidationError(issues);
	}

	return data;
};

export const validateScheduleData = (data: unknown, options: ScheduleValidationOptions = {}): string[] => {
	const issues: string[] = [];

	if (!isRecord(data)) {
		return ["Schedule data is not an object"];
	}

	const meta = data.meta;
	const slots = data.slots;
	const days = data.days;
	const events = data.events;
	const categories = data.categories;
	const speakers = data.speakers;

	if (!isRecord(meta)) issues.push("Meta: missing metadata object");
	if (!Array.isArray(slots)) issues.push("Slots: missing slot list");
	if (!Array.isArray(days)) issues.push("Days: missing day list");
	if (!Array.isArray(events)) issues.push("Events: missing event list");
	if (!Array.isArray(categories)) issues.push("Categories: missing category list");
	if (!Array.isArray(speakers)) issues.push("Speakers: missing speaker list");

	if (issues.length > 0) return issues;

	const scheduleData = data as unknown as ScheduleData;
	if (!scheduleData.meta.title?.trim()) issues.push("Meta: title is required");
	if (!scheduleData.meta.description?.trim()) issues.push("Meta: description is required");
	if (scheduleData.slots.length === 0) issues.push("Slots: at least one slot is required");

	const slotSet = new Set<string>();
	scheduleData.slots.forEach(slot => {
		if (!slot.trim()) issues.push("Slots: slot values cannot be empty");
		checkDuplicate("Slots", slot, slotSet, issues);
	});

	const eventIds = new Set<string>();
	const speakerIds = new Set<string>();
	const dayIds = new Set<string>();
	const categoryIds = new Set<string>();

	scheduleData.speakers.forEach(speaker => {
		if (!speaker.id) issues.push("Speakers: id is required");
		checkDuplicate("Speakers", speaker.id, speakerIds, issues);
		if (speaker.avatar?.key && options.avatarKeys && !options.avatarKeys.has(speaker.avatar.key)) {
			issues.push(`Speakers: avatar_key "${speaker.avatar.key}" is not present in repo assets`);
		}
	});

	scheduleData.categories.forEach(category => {
		if (!category.id) issues.push("Categories: id is required");
		if (!category.label) issues.push(`Categories: "${category.id || "(missing id)"}" label is required`);
		checkDuplicate("Categories", category.id, categoryIds, issues);
		if (!isScheduleCategoryTheme(category.theme)) issues.push(`Categories: "${category.id}" has invalid theme "${category.theme}"`);
	});

	scheduleData.events.forEach(event => {
		if (!event.id) issues.push("Events: id is required");
		if (!event.name) issues.push(`Events: "${event.id || "(missing id)"}" name is required`);
		if (!event.summary) issues.push(`Events: "${event.id || "(missing id)"}" summary is required`);
		checkDuplicate("Events", event.id, eventIds, issues);
		if (!event.categoryId) issues.push(`Events: "${event.id}" category_id is required`);
		if (event.categoryId && !categoryIds.has(event.categoryId)) issues.push(`Events: "${event.id}" references missing category "${event.categoryId}"`);
		if (typeof event.isInteractive !== "boolean") issues.push(`Events: "${event.id}" has invalid is_interactive value`);
		event.speakers?.forEach(speakerId => {
			if (!speakerIds.has(speakerId)) issues.push(`Events: "${event.id}" references missing speaker "${speakerId}"`);
		});
		if (event.image?.key && options.imageKeys && !options.imageKeys.has(event.image.key)) {
			issues.push(`Events: image_key "${event.image.key}" is not present in repo assets`);
		}
	});

	scheduleData.days.forEach(day => {
		if (!day.id) issues.push("Days: id is required");
		if (day.title.length === 0) issues.push(`Days: "${day.id || "(missing id)"}" title is required`);
		if (!day.date) issues.push(`Days: "${day.id || "(missing id)"}" date is required`);
		if (!day.subtitle) issues.push(`Days: "${day.id || "(missing id)"}" subtitle is required`);
		checkDuplicate("Days", day.id, dayIds, issues);
		if (!isScheduleDayType(day.type)) issues.push(`Days: "${day.id}" has invalid type "${day.type}"`);
	});

	scheduleData.days.forEach(day => {
		const occupiedSlots = new Set<string>();
		day.blocks.forEach(block => {
			const startIndex = scheduleData.slots.indexOf(block.startSlot);
			if (startIndex === -1) {
				issues.push(`Blocks: day "${day.id}" uses invalid start_slot "${block.startSlot}"`);
				return;
			}
			if (!eventIds.has(block.eventId)) {
				issues.push(`Blocks: day "${day.id}" references missing event "${block.eventId}"`);
			}
			if (!Number.isSafeInteger(block.span) || block.span < 1) {
				issues.push(`Blocks: day "${day.id}" event "${block.eventId}" has invalid span "${block.span}"`);
				return;
			}
			if (startIndex + block.span > scheduleData.slots.length) {
				issues.push(`Blocks: day "${day.id}" event "${block.eventId}" span exceeds slot range`);
				return;
			}
			for (let offset = 0; offset < block.span; offset += 1) {
				const slot = scheduleData.slots[startIndex + offset];
				if (occupiedSlots.has(slot)) {
					issues.push(`Blocks: day "${day.id}" has overlapping block at "${slot}"`);
				}
				occupiedSlots.add(slot);
			}
		});
	});

	return issues;
};

export const collectScheduleText = (data: ScheduleData): string => {
	const parts = [data.meta.title, data.meta.description, data.meta.note ?? "", ...data.slots];
	for (const day of data.days) parts.push(day.id, ...day.title, day.date, day.subtitle, day.type);
	for (const category of data.categories) parts.push(category.id, category.label, category.theme);
	for (const event of data.events) parts.push(event.id, event.name, event.summary, event.categoryId, ...(event.description ?? []), event.image?.alt ?? "", ...(event.speakers ?? []));
	for (const speaker of data.speakers) parts.push(speaker.id, speaker.name ?? "", speaker.description ?? "", speaker.avatar?.alt ?? "");
	return parts.join("\n");
};

export const getScheduleSheetNames = (): ScheduleSheetName[] => [...sheetOrder];

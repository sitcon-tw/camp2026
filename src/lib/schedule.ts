export const SCHEDULE_SPREADSHEET_ID = "1gYc0nbbDmxtDiHXurV8bIAZZq30Ev0ADc4Ew44YzZ3g";

export const SCHEDULE_SHEET_NAMES = {
	session: "Session",
	speaker: "Speaker",
	sessionType: "SessionType",
	room: "Room",
	tag: "Tag"
} as const;

export const SCHEDULE_SHEET_RANGES = {
	[SCHEDULE_SHEET_NAMES.session]: "A1:AE",
	[SCHEDULE_SHEET_NAMES.speaker]: "A1:F",
	[SCHEDULE_SHEET_NAMES.sessionType]: "A1:F",
	[SCHEDULE_SHEET_NAMES.room]: "A1:E",
	[SCHEDULE_SHEET_NAMES.tag]: "A1:E"
} as const;

export const SCHEDULE_REQUIRED_HEADERS = {
	[SCHEDULE_SHEET_NAMES.session]: [
		"title_zh",
		"room",
		"type",
		"description_zh",
		"start",
		"end",
		"duration",
		"speaker1",
		"slide",
		"id",
		"title_en",
		"description_en",
		"speaker2",
		"speaker3",
		"speaker4",
		"speaker5",
		"speaker1id",
		"speaker2id",
		"speaker3id",
		"speaker4id",
		"speaker5id",
		"qa",
		"tag1",
		"tag2",
		"tag3",
		"co_write",
		"live",
		"broadcast",
		"record",
		"language",
		"uri"
	],
	[SCHEDULE_SHEET_NAMES.speaker]: ["name_zh", "bio_zh", "id", "avatar", "name_en", "bio_en"],
	[SCHEDULE_SHEET_NAMES.sessionType]: ["id", "name_zh", "name_en", "description_zh", "description_en", "note"],
	[SCHEDULE_SHEET_NAMES.room]: ["id", "name_zh", "name_en", "description_zh", "description_en"],
	[SCHEDULE_SHEET_NAMES.tag]: ["id", "name_zh", "name_en", "description_zh", "description_en"]
} as const;

export const SCHEDULE_DAY_TYPES = ["opening", "software", "artificial-intelligence", "security", "closing"] as const;
export const SCHEDULE_CATEGORY_THEMES = ["green", "blue", "orange", "sky", "lavender", "dark"] as const;

export type ScheduleSheetName = (typeof SCHEDULE_SHEET_NAMES)[keyof typeof SCHEDULE_SHEET_NAMES];
export type ScheduleDayType = (typeof SCHEDULE_DAY_TYPES)[number];
export type ScheduleCategoryTheme = (typeof SCHEDULE_CATEGORY_THEMES)[number];
export type ScheduleCellValue = string | number | boolean | null | undefined;
export type ScheduleSheetValues = Partial<Record<ScheduleSheetName, ScheduleCellValue[][]>>;
export type NullableScheduleString = string | null;

export interface LocalizedText {
	title: string;
	description: string;
}

export interface LocalizedName {
	name: string;
	description: string;
}

export interface Course {
	id: string | number;
	room: string;
	type: string;
	start: string;
	end: string;
	duration: string;
	slide: NullableScheduleString;
	qa: NullableScheduleString;
	co_write: NullableScheduleString;
	live: NullableScheduleString;
	broadcast: NullableScheduleString;
	record: NullableScheduleString;
	language: NullableScheduleString;
	uri: NullableScheduleString;
	zh: LocalizedText;
	en: LocalizedText;
	speakers: string[];
	tags: string[];
	expo?: string[];
}

export interface Speaker {
	id: string;
	avatar: string;
	zh: {
		name: string;
		bio: string;
	};
	en: {
		name: string;
		bio: string;
	};
}

export interface SessionType {
	id: string;
	note?: string;
	zh: LocalizedName;
	en: LocalizedName;
}

export interface Room {
	id: string;
	zh: LocalizedName;
	en: LocalizedName;
}

export interface ScheduleTag {
	id: string;
	zh: LocalizedName;
	en: LocalizedName;
}

export interface ScheduleData {
	sessions: Course[];
	speakers: Speaker[];
	session_types: SessionType[];
	rooms: Room[];
	tags: ScheduleTag[];
}

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

export interface SchedulePreviewSpeaker {
	id: string;
	name?: string;
	description?: string;
	avatar?: {
		key: string;
		alt?: string;
	};
}

export interface SchedulePreviewCategory {
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
	speakers?: SchedulePreviewSpeaker["id"][];
	slidesUrl?: string;
	notesUrl?: string;
}

export interface SchedulePreviewData {
	meta: ScheduleMeta;
	slots: string[];
	days: ScheduleDay[];
	events: ScheduleEvent[];
	categories: SchedulePreviewCategory[];
	speakers: SchedulePreviewSpeaker[];
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

interface ParsedCourseTime {
	dateKey: string;
	minutes: number;
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
const sessionHeaders = SCHEDULE_REQUIRED_HEADERS[SCHEDULE_SHEET_NAMES.session];
const speakerHeaders = SCHEDULE_REQUIRED_HEADERS[SCHEDULE_SHEET_NAMES.speaker];
const sessionColumnIndex = Object.fromEntries(sessionHeaders.map((column, index) => [column, index])) as Record<(typeof sessionHeaders)[number], number>;

const defaultPreviewMeta: ScheduleMeta = {
	title: "活動日程",
	description: "SITCON Camp 2026 將圍繞軟體工程、人工智慧與資訊安全三大主線展開，並穿插交流、實作與活動。"
};

const previewDayConfig: Record<string, Omit<ScheduleDay, "date" | "blocks">> = {
	day1: {
		id: "day-one",
		title: ["主線課程", "先導日"],
		subtitle: "Day 1",
		type: "opening"
	},
	day2: {
		id: "day-two",
		title: ["軟體工程", "主題日"],
		subtitle: "Day 2",
		type: "software"
	},
	day3: {
		id: "day-three",
		title: ["人工智慧", "主題日"],
		subtitle: "Day 3",
		type: "artificial-intelligence"
	},
	day4: {
		id: "day-four",
		title: ["資訊安全", "主題日"],
		subtitle: "Day 4",
		type: "security"
	},
	day5: {
		id: "day-five",
		title: ["資訊交流", "探索日"],
		subtitle: "Day 5",
		type: "closing"
	}
};

const previewCategories: SchedulePreviewCategory[] = [
	{ id: "journey", label: "啟程", theme: "green" },
	{ id: "main-course", label: "主線課程", theme: "blue" },
	{ id: "activity", label: "活動", theme: "orange" },
	{ id: "life", label: "生活", theme: "sky" },
	{ id: "broad-course", label: "廣度課程", theme: "lavender" },
	{ id: "other", label: "其他", theme: "lavender" },
	{ id: "closing", label: "總結", theme: "dark" }
];

const previewEventDetails: Record<string, Pick<ScheduleEvent, "categoryId"> & Partial<Pick<ScheduleEvent, "image">>> = {
	opening: { categoryId: "journey", image: { key: "start-and-opening", alt: "SITCON Camp 開幕現場" } },
	"broad-course": { categoryId: "broad-course", image: { key: "broad-course", alt: "廣度課程活動現場" } },
	quest: { categoryId: "activity", image: { key: "quest", alt: "學員參與闖關活動" } },
	"web-system-intro": { categoryId: "journey", image: { key: "agent-battle", alt: "學員操作著電腦" } },
	"lab-setup": { categoryId: "journey", image: { key: "lab-setup", alt: "課程環境設定" } },
	"software-main": { categoryId: "main-course", image: { key: "software-main", alt: "軟體工程主題日課程現場" } },
	"ml-main": { categoryId: "main-course", image: { key: "ai-main", alt: "人工智慧主題日課程現場" } },
	"security-main": { categoryId: "main-course", image: { key: "security-main", alt: "資訊安全主題日課程現場" } },
	"agentic-coding": { categoryId: "main-course", image: { key: "software-main", alt: "AI 寫程式經驗交流" } },
	heisenbug: { categoryId: "activity", image: { key: "heisenbug", alt: "學員參與海森堡 Bug 活動" } },
	"reality-puzzle": { categoryId: "activity", image: { key: "reality-puzzle", alt: "學員參與實境解謎" } },
	"open-source-sharing": { categoryId: "broad-course", image: { key: "learning-wrap", alt: "開源理念分享" } },
	"community-fair": { categoryId: "activity", image: { key: "community-fair", alt: "社群博覽會攤位交流現場" } },
	"vision-cafe": { categoryId: "activity", image: { key: "vision-cafe", alt: "視界咖啡館交流現場" } },
	"sigs-ak": { categoryId: "activity", image: { key: "roundtable-discussion", alt: "學員在專題圓桌討論會中交流討論" } },
	closing: { categoryId: "closing", image: { key: "closing", alt: "閉幕活動與學員合影現場" } },
	"return-home": { categoryId: "closing" },
	lunch: { categoryId: "life" },
	dinner: { categoryId: "life" }
};

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

const isHttpUrl = (value: string): boolean => {
	try {
		const url = new URL(value);
		return url.protocol === "http:" || url.protocol === "https:";
	} catch {
		return false;
	}
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

const emptyToNull = (value: string): NullableScheduleString => value.trim() || null;

const slugify = (value: string): string =>
	value
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");

const hashText = (value: string): string =>
	Array.from(value)
		.reduce((hash, char) => {
			const nextHash = (hash * 31 + char.codePointAt(0)!) >>> 0;
			return nextHash;
		}, 0)
		.toString(36);

const stableIdFromText = (prefix: string, value: string): string => slugify(value) || `${prefix}-${hashText(value)}`;

const getSessionCell = (row: string[], column: keyof typeof sessionColumnIndex): string => row[sessionColumnIndex[column]] ?? "";

const isSessionHelpRow = (row: string[]): boolean => getSessionCell(row, "title_zh").includes("課程名稱") && getSessionCell(row, "id").includes("UUID");

const isSpeakerHelpRow = (row: string[]): boolean => row[speakerHeaders.indexOf("name_zh")]?.includes("講者名稱") === true && row[speakerHeaders.indexOf("id")] === "UUID";

const isBlankRow = (row: string[]): boolean => row.every(cell => !cell.trim());

const parseCourseTime = (value: string): ParsedCourseTime | null => {
	const normalized = value.trim();
	const isoMatch = normalized.match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{1,2}):(\d{2})(?::\d{2})?(?:[+-]\d{2}:\d{2}|Z)?$/);
	if (!isoMatch) return null;

	const [, year, month, day, hour, minute] = isoMatch;
	const hours = Number(hour);
	const minutes = Number(minute);
	if (!Number.isInteger(hours) || !Number.isInteger(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;

	return {
		dateKey: `${year}-${month}-${day}`,
		minutes: hours * 60 + minutes
	};
};

const formatSlot = (minutes: number): string => `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, "0")}`;

const formatMonthDay = (dateKey: string): string => {
	const [, month, day] = dateKey.match(/^\d{4}-(\d{2})-(\d{2})$/) ?? [];
	if (!month || !day) return dateKey;
	return `${Number(month)}/${Number(day)}`;
};

const gcd = (left: number, right: number): number => {
	let a = Math.abs(left);
	let b = Math.abs(right);
	while (b !== 0) {
		const next = a % b;
		a = b;
		b = next;
	}
	return a;
};

const getCourseSpeakerIds = (row: string[]): string[] => {
	const names = ["speaker1", "speaker2", "speaker3", "speaker4", "speaker5"].map(column => getSessionCell(row, column as keyof typeof sessionColumnIndex));
	const ids = ["speaker1id", "speaker2id", "speaker3id", "speaker4id", "speaker5id"].map(column => getSessionCell(row, column as keyof typeof sessionColumnIndex));

	return names.map((name, index) => ids[index] || (name ? stableIdFromText("speaker", name) : "")).filter(Boolean);
};

const getCourseTags = (row: string[]): string[] => ["tag1", "tag2", "tag3"].map(column => getSessionCell(row, column as keyof typeof sessionColumnIndex)).filter(Boolean);

const parseSessions = (values: ScheduleSheetValues, issues: string[]): Course[] => {
	const rows = readTable(values, SCHEDULE_SHEET_NAMES.session, issues);
	const sessions: Course[] = [];

	rows.forEach((row, index) => {
		const sourceRowNumber = index + 2;
		if (isSessionHelpRow(row) || isBlankRow(row)) return;

		const titleZh = getSessionCell(row, "title_zh");
		const descriptionZh = getSessionCell(row, "description_zh");
		const id = getSessionCell(row, "id") || stableIdFromText("session", titleZh);
		const room = getSessionCell(row, "room");
		const type = getSessionCell(row, "type");
		const start = getSessionCell(row, "start");
		const end = getSessionCell(row, "end");
		const startTime = parseCourseTime(start);
		const endTime = parseCourseTime(end);

		if (!titleZh) issues.push(`${SCHEDULE_SHEET_NAMES.session}: row ${sourceRowNumber} title_zh is required`);
		if (!id) issues.push(`${SCHEDULE_SHEET_NAMES.session}: row ${sourceRowNumber} id is required`);
		if (!room) issues.push(`${SCHEDULE_SHEET_NAMES.session}: row ${sourceRowNumber} room is required`);
		if (!type) issues.push(`${SCHEDULE_SHEET_NAMES.session}: row ${sourceRowNumber} type is required`);
		if (!startTime) issues.push(`${SCHEDULE_SHEET_NAMES.session}: row ${sourceRowNumber} has invalid start "${start}"`);
		if (!endTime) issues.push(`${SCHEDULE_SHEET_NAMES.session}: row ${sourceRowNumber} has invalid end "${end}"`);
		if (startTime && endTime && startTime.dateKey !== endTime.dateKey) issues.push(`${SCHEDULE_SHEET_NAMES.session}: row ${sourceRowNumber} start and end must be on the same date`);
		if (startTime && endTime && endTime.minutes <= startTime.minutes) issues.push(`${SCHEDULE_SHEET_NAMES.session}: row ${sourceRowNumber} end must be after start`);
		if (!titleZh || !id || !room || !type || !startTime || !endTime) return;

		sessions.push({
			id,
			room,
			type,
			start,
			end,
			duration: getSessionCell(row, "duration"),
			slide: emptyToNull(getSessionCell(row, "slide")),
			qa: emptyToNull(getSessionCell(row, "qa")),
			co_write: emptyToNull(getSessionCell(row, "co_write")),
			live: emptyToNull(getSessionCell(row, "live")),
			broadcast: emptyToNull(getSessionCell(row, "broadcast")),
			record: emptyToNull(getSessionCell(row, "record")),
			language: emptyToNull(getSessionCell(row, "language")),
			uri: emptyToNull(getSessionCell(row, "uri")),
			zh: {
				title: titleZh,
				description: descriptionZh
			},
			en: {
				title: getSessionCell(row, "title_en") || titleZh,
				description: getSessionCell(row, "description_en") || descriptionZh
			},
			speakers: getCourseSpeakerIds(row),
			tags: getCourseTags(row)
		});
	});

	return sessions;
};

const parseSpeakers = (values: ScheduleSheetValues, issues: string[]): Speaker[] => {
	const rows = readTable(values, SCHEDULE_SHEET_NAMES.speaker, issues);
	return rows
		.filter(row => !isSpeakerHelpRow(row) && !isBlankRow(row))
		.map((row, index) => {
			const [nameZh, bioZh, id, avatar, nameEn, bioEn] = row;
			if (!id) issues.push(`${SCHEDULE_SHEET_NAMES.speaker}: row ${index + 2} id is required`);
			if (!nameZh) issues.push(`${SCHEDULE_SHEET_NAMES.speaker}: row ${index + 2} name_zh is required`);

			return {
				id,
				avatar,
				zh: {
					name: nameZh,
					bio: bioZh
				},
				en: {
					name: nameEn || nameZh,
					bio: bioEn || bioZh
				}
			};
		});
};

const parseSessionTypes = (values: ScheduleSheetValues, issues: string[]): SessionType[] => {
	const rows = readTable(values, SCHEDULE_SHEET_NAMES.sessionType, issues);
	return rows
		.filter(row => !isBlankRow(row))
		.map(([id, nameZh, nameEn, descriptionZh, descriptionEn, note], index) => {
			if (!id) issues.push(`${SCHEDULE_SHEET_NAMES.sessionType}: row ${index + 2} id is required`);
			if (!nameZh) issues.push(`${SCHEDULE_SHEET_NAMES.sessionType}: row ${index + 2} name_zh is required`);

			const sessionType: SessionType = {
				id,
				zh: {
					name: nameZh,
					description: descriptionZh
				},
				en: {
					name: nameEn || nameZh,
					description: descriptionEn || descriptionZh
				}
			};
			if (note) sessionType.note = note;
			return sessionType;
		});
};

const parseRooms = (values: ScheduleSheetValues, issues: string[]): Room[] => {
	const rows = readTable(values, SCHEDULE_SHEET_NAMES.room, issues);
	return rows
		.filter(row => !isBlankRow(row))
		.map(([id, nameZh, nameEn, descriptionZh, descriptionEn], index) => {
			if (!id) issues.push(`${SCHEDULE_SHEET_NAMES.room}: row ${index + 2} id is required`);
			if (!nameZh) issues.push(`${SCHEDULE_SHEET_NAMES.room}: row ${index + 2} name_zh is required`);

			return {
				id,
				zh: {
					name: nameZh,
					description: descriptionZh
				},
				en: {
					name: nameEn || nameZh,
					description: descriptionEn || descriptionZh
				}
			};
		});
};

const parseTags = (values: ScheduleSheetValues, issues: string[]): ScheduleTag[] => {
	const rows = readTable(values, SCHEDULE_SHEET_NAMES.tag, issues);
	return rows
		.filter(row => !isBlankRow(row))
		.map(([id, nameZh, nameEn, descriptionZh, descriptionEn], index) => {
			if (!id) issues.push(`${SCHEDULE_SHEET_NAMES.tag}: row ${index + 2} id is required`);
			if (!nameZh) issues.push(`${SCHEDULE_SHEET_NAMES.tag}: row ${index + 2} name_zh is required`);

			return {
				id,
				zh: {
					name: nameZh,
					description: descriptionZh
				},
				en: {
					name: nameEn || nameZh,
					description: descriptionEn || descriptionZh
				}
			};
		});
};

const canonicalCourseId = (course: Course): string => {
	const id = String(course.id);
	const title = course.zh.title;
	const directMatch = previewEventDetails[id];
	if (directMatch) return id;

	if (id.startsWith("lunch-")) return "lunch";
	if (id.startsWith("dinner-")) return "dinner";
	if (id.startsWith("sigs-ak-")) return "sigs-ak";
	if (id.startsWith("software-main-")) return "software-main";
	if (id.startsWith("ml-main-")) return "ml-main";
	if (id.startsWith("security-main-")) return "security-main";
	if (title === "午餐") return "lunch";
	if (title === "晚餐") return "dinner";
	if (title === "爐邊夜談") return "sigs-ak";
	if (title === "軟工主線課程") return "software-main";
	if (title === "人工智慧主線課程") return "ml-main";
	if (title === "資安主線課程") return "security-main";

	return id;
};

const inferPreviewCategoryId = (course: Course): string => {
	const configured = previewEventDetails[canonicalCourseId(course)]?.categoryId;
	if (configured) return configured;

	const normalizedType = course.type.trim().toLowerCase();
	if (normalizedType === "main") return "main-course";
	if (normalizedType === "broad") return "broad-course";
	if (["game", "community", "hackathon"].includes(normalizedType)) return "activity";
	if (normalizedType === "home") return "closing";
	return "other";
};

const getPreviewSummary = (course: Course): string => splitFilledLines(course.zh.description)[0] ?? course.zh.title;

const createPreviewSlots = (sessions: Course[], issues: string[]): string[] => {
	const parsedTimes = sessions.flatMap(session => [parseCourseTime(session.start), parseCourseTime(session.end)]).filter((time): time is ParsedCourseTime => Boolean(time));
	if (parsedTimes.length === 0) return [];

	const boundaries = parsedTimes.map(time => time.minutes);
	const minBoundary = Math.min(...boundaries);
	const maxBoundary = Math.max(...boundaries);
	const step = boundaries.reduce((currentStep, boundary) => {
		const delta = boundary - minBoundary;
		return delta > 0 ? gcd(currentStep || delta, delta) : currentStep;
	}, 0);
	const slotStep = step || 60;

	if (slotStep < 15) issues.push(`${SCHEDULE_SHEET_NAMES.session}: schedule grid resolution is too small (${slotStep} minutes)`);

	return Array.from({ length: Math.ceil((maxBoundary - minBoundary) / slotStep) }, (_, index) => formatSlot(minBoundary + index * slotStep));
};

const createPreviewDays = (sessions: Course[], slots: string[], issues: string[]): ScheduleDay[] => {
	const sessionsByRoom = new Map<string, Course[]>();
	for (const session of sessions) {
		sessionsByRoom.set(session.room, [...(sessionsByRoom.get(session.room) ?? []), session]);
	}

	return Array.from(sessionsByRoom.entries())
		.map(([roomId, roomSessions]) => {
			const sortedSessions = [...roomSessions].sort((left, right) => {
				const leftStart = parseCourseTime(left.start);
				const rightStart = parseCourseTime(right.start);
				return (leftStart?.dateKey ?? "").localeCompare(rightStart?.dateKey ?? "") || (leftStart?.minutes ?? 0) - (rightStart?.minutes ?? 0);
			});
			const firstSession = sortedSessions[0];
			const firstStart = parseCourseTime(firstSession.start);
			const roomKey = roomId.trim().toLowerCase();
			const config = previewDayConfig[roomKey];
			const blocks = sortedSessions.map(session => {
				const start = parseCourseTime(session.start);
				const end = parseCourseTime(session.end);
				const startSlot = start ? formatSlot(start.minutes) : "";
				const startIndex = slots.indexOf(startSlot);
				const endIndex = end ? slots.indexOf(formatSlot(end.minutes)) : -1;
				const span = endIndex === -1 ? slots.length - startIndex : endIndex - startIndex;
				if (!start || !end || startIndex === -1 || span < 1) issues.push(`${SCHEDULE_SHEET_NAMES.session}: "${session.id}" does not align to the schedule grid`);

				return {
					startSlot,
					span: Math.max(1, span),
					eventId: String(session.id)
				};
			});

			return {
				sortDate: firstStart?.dateKey ?? "",
				sortTime: firstStart?.minutes ?? 0,
				day: {
					id: config?.id ?? stableIdFromText("room", roomId),
					title: config?.title ?? [roomId],
					date: firstStart ? formatMonthDay(firstStart.dateKey) : "",
					subtitle: config?.subtitle ?? roomId,
					type: config?.type ?? "closing",
					blocks
				}
			};
		})
		.sort((left, right) => left.sortDate.localeCompare(right.sortDate) || left.sortTime - right.sortTime)
		.map(entry => entry.day);
};

const createPreviewEvents = (sessions: Course[]): ScheduleEvent[] =>
	sessions.map(course => {
		const canonicalId = canonicalCourseId(course);
		const configured = previewEventDetails[canonicalId];
		const description = splitLines(course.zh.description);
		const event: ScheduleEvent = {
			id: String(course.id),
			name: course.zh.title,
			summary: getPreviewSummary(course),
			categoryId: inferPreviewCategoryId(course),
			isInteractive: Boolean(course.zh.description.trim() || configured?.image || course.speakers.length > 0 || course.slide || course.co_write || course.record || course.uri)
		};
		if (description.some(line => line.trim())) event.description = description;
		if (configured?.image) event.image = configured.image;
		if (course.speakers.length > 0) event.speakers = course.speakers;
		if (course.slide) event.slidesUrl = course.slide;
		if (course.co_write) event.notesUrl = course.co_write;
		return event;
	});

const createPreviewSpeakers = (speakers: Speaker[]): SchedulePreviewSpeaker[] =>
	speakers.map(speaker => {
		const previewSpeaker: SchedulePreviewSpeaker = {
			id: speaker.id,
			name: speaker.zh.name,
			description: speaker.zh.bio
		};
		const avatarKey = speaker.avatar.replace(/\.(jpe?g|png|webp)$/i, "");
		if (avatarKey) {
			previewSpeaker.avatar = {
				key: avatarKey,
				alt: speaker.zh.name
			};
		}
		return previewSpeaker;
	});

export const scheduleDataToPreviewData = (data: ScheduleData, options: ScheduleValidationOptions = {}): SchedulePreviewData => {
	const issues: string[] = [];
	const slots = createPreviewSlots(data.sessions, issues);
	const previewData: SchedulePreviewData = {
		meta: defaultPreviewMeta,
		slots,
		days: createPreviewDays(data.sessions, slots, issues),
		events: createPreviewEvents(data.sessions),
		categories: previewCategories,
		speakers: createPreviewSpeakers(data.speakers)
	};

	issues.push(...validateSchedulePreviewData(previewData, options));
	if (issues.length > 0) throw new ScheduleValidationError(issues);

	return previewData;
};

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
	const data: ScheduleData = {
		sessions: parseSessions(values, issues),
		speakers: parseSpeakers(values, issues),
		session_types: parseSessionTypes(values, issues),
		rooms: parseRooms(values, issues),
		tags: parseTags(values, issues)
	};

	issues.push(...validateScheduleData(data));
	if (issues.length === 0) {
		scheduleDataToPreviewData(data, options);
	}

	if (issues.length > 0) {
		throw new ScheduleValidationError(issues);
	}

	return data;
};

export const validateScheduleData = (data: unknown): string[] => {
	const issues: string[] = [];

	if (!isRecord(data)) {
		return ["Schedule data is not an object"];
	}

	if (!Array.isArray(data.sessions)) issues.push("sessions: missing session list");
	if (!Array.isArray(data.speakers)) issues.push("speakers: missing speaker list");
	if (!Array.isArray(data.session_types)) issues.push("session_types: missing session type list");
	if (!Array.isArray(data.rooms)) issues.push("rooms: missing room list");
	if (!Array.isArray(data.tags)) issues.push("tags: missing tag list");
	if (issues.length > 0) return issues;

	const scheduleData = data as unknown as ScheduleData;
	const sessionIds = new Set<string>();
	const speakerIds = new Set<string>();
	const sessionTypeIds = new Set<string>();
	const roomIds = new Set<string>();
	const tagIds = new Set<string>();

	scheduleData.speakers.forEach(speaker => {
		if (!speaker.id) issues.push("speakers: id is required");
		if (!speaker.zh?.name) issues.push(`speakers: "${speaker.id || "(missing id)"}" zh.name is required`);
		checkDuplicate("speakers", speaker.id, speakerIds, issues);
	});

	scheduleData.session_types.forEach(sessionType => {
		if (!sessionType.id) issues.push("session_types: id is required");
		if (!sessionType.zh?.name) issues.push(`session_types: "${sessionType.id || "(missing id)"}" zh.name is required`);
		checkDuplicate("session_types", sessionType.id, sessionTypeIds, issues);
	});

	scheduleData.rooms.forEach(room => {
		if (!room.id) issues.push("rooms: id is required");
		if (!room.zh?.name) issues.push(`rooms: "${room.id || "(missing id)"}" zh.name is required`);
		checkDuplicate("rooms", room.id, roomIds, issues);
	});

	scheduleData.tags.forEach(tag => {
		if (!tag.id) issues.push("tags: id is required");
		checkDuplicate("tags", tag.id, tagIds, issues);
	});

	scheduleData.sessions.forEach(session => {
		const id = String(session.id ?? "");
		const start = parseCourseTime(session.start);
		const end = parseCourseTime(session.end);
		if (!id) issues.push("sessions: id is required");
		checkDuplicate("sessions", id, sessionIds, issues);
		if (!session.zh?.title) issues.push(`sessions: "${id || "(missing id)"}" zh.title is required`);
		if (!session.room) issues.push(`sessions: "${id}" room is required`);
		if (session.room && !roomIds.has(session.room)) issues.push(`sessions: "${id}" references missing room "${session.room}"`);
		if (!session.type) issues.push(`sessions: "${id}" type is required`);
		if (session.type && !sessionTypeIds.has(session.type)) issues.push(`sessions: "${id}" references missing type "${session.type}"`);
		if (!start) issues.push(`sessions: "${id}" has invalid start "${session.start}"`);
		if (!end) issues.push(`sessions: "${id}" has invalid end "${session.end}"`);
		if (start && end && start.dateKey !== end.dateKey) issues.push(`sessions: "${id}" start and end must be on the same date`);
		if (start && end && end.minutes <= start.minutes) issues.push(`sessions: "${id}" end must be after start`);
		["slide", "qa", "co_write", "live", "broadcast", "record", "uri"].forEach(key => {
			const value = session[key as keyof Course];
			if (typeof value === "string" && value && !isHttpUrl(value)) issues.push(`sessions: "${id}" has invalid ${key} value`);
		});
		session.speakers?.forEach(speakerId => {
			if (!speakerIds.has(speakerId)) issues.push(`sessions: "${id}" references missing speaker "${speakerId}"`);
		});
		session.tags?.forEach(tagId => {
			if (!tagIds.has(tagId)) issues.push(`sessions: "${id}" references missing tag "${tagId}"`);
		});
	});

	return issues;
};

export const validateSchedulePreviewData = (data: unknown, options: ScheduleValidationOptions = {}): string[] => {
	const issues: string[] = [];

	if (!isRecord(data)) {
		return ["Schedule preview data is not an object"];
	}

	const previewData = data as unknown as SchedulePreviewData;
	if (!previewData.meta?.title?.trim()) issues.push("Preview meta: title is required");
	if (!previewData.meta?.description?.trim()) issues.push("Preview meta: description is required");
	if (!Array.isArray(previewData.slots) || previewData.slots.length === 0) issues.push("Preview slots: at least one slot is required");
	if (!Array.isArray(previewData.days)) issues.push("Preview days: missing day list");
	if (!Array.isArray(previewData.events)) issues.push("Preview events: missing event list");
	if (!Array.isArray(previewData.categories)) issues.push("Preview categories: missing category list");
	if (!Array.isArray(previewData.speakers)) issues.push("Preview speakers: missing speaker list");
	if (issues.length > 0) return issues;

	const slotSet = new Set<string>();
	previewData.slots.forEach(slot => {
		if (!slot.trim()) issues.push("Preview slots: slot values cannot be empty");
		checkDuplicate("Preview slots", slot, slotSet, issues);
	});

	const eventIds = new Set<string>();
	const speakerIds = new Set<string>();
	const dayIds = new Set<string>();
	const categoryIds = new Set<string>();

	previewData.speakers.forEach(speaker => {
		if (!speaker.id) issues.push("Preview speakers: id is required");
		checkDuplicate("Preview speakers", speaker.id, speakerIds, issues);
		if (speaker.avatar?.key && options.avatarKeys && !options.avatarKeys.has(speaker.avatar.key)) {
			issues.push(`Preview speakers: avatar_key "${speaker.avatar.key}" is not present in repo assets`);
		}
	});

	previewData.categories.forEach(category => {
		if (!category.id) issues.push("Preview categories: id is required");
		if (!category.label) issues.push(`Preview categories: "${category.id || "(missing id)"}" label is required`);
		checkDuplicate("Preview categories", category.id, categoryIds, issues);
		if (!isScheduleCategoryTheme(category.theme)) issues.push(`Preview categories: "${category.id}" has invalid theme "${category.theme}"`);
	});

	previewData.events.forEach(event => {
		if (!event.id) issues.push("Preview events: id is required");
		if (!event.name) issues.push(`Preview events: "${event.id || "(missing id)"}" name is required`);
		if (!event.summary) issues.push(`Preview events: "${event.id || "(missing id)"}" summary is required`);
		checkDuplicate("Preview events", event.id, eventIds, issues);
		if (!event.categoryId) issues.push(`Preview events: "${event.id}" category_id is required`);
		if (event.categoryId && !categoryIds.has(event.categoryId)) issues.push(`Preview events: "${event.id}" references missing category "${event.categoryId}"`);
		if (typeof event.isInteractive !== "boolean") issues.push(`Preview events: "${event.id}" has invalid is_interactive value`);
		if (event.slidesUrl && !isHttpUrl(event.slidesUrl)) issues.push(`Preview events: "${event.id}" has invalid slides_url value`);
		if (event.notesUrl && !isHttpUrl(event.notesUrl)) issues.push(`Preview events: "${event.id}" has invalid notes_url value`);
		event.speakers?.forEach(speakerId => {
			if (!speakerIds.has(speakerId)) issues.push(`Preview events: "${event.id}" references missing speaker "${speakerId}"`);
		});
		if (event.image?.key && options.imageKeys && !options.imageKeys.has(event.image.key)) {
			issues.push(`Preview events: image_key "${event.image.key}" is not present in repo assets`);
		}
	});

	previewData.days.forEach(day => {
		if (!day.id) issues.push("Preview days: id is required");
		if (day.title.length === 0) issues.push(`Preview days: "${day.id || "(missing id)"}" title is required`);
		if (!day.date) issues.push(`Preview days: "${day.id || "(missing id)"}" date is required`);
		if (!day.subtitle) issues.push(`Preview days: "${day.id || "(missing id)"}" subtitle is required`);
		checkDuplicate("Preview days", day.id, dayIds, issues);
		if (!isScheduleDayType(day.type)) issues.push(`Preview days: "${day.id}" has invalid type "${day.type}"`);
	});

	previewData.days.forEach(day => {
		const occupiedSlots = new Set<string>();
		day.blocks.forEach(block => {
			const startIndex = previewData.slots.indexOf(block.startSlot);
			if (startIndex === -1) {
				issues.push(`Preview blocks: day "${day.id}" uses invalid start_slot "${block.startSlot}"`);
				return;
			}
			if (!eventIds.has(block.eventId)) {
				issues.push(`Preview blocks: day "${day.id}" references missing event "${block.eventId}"`);
			}
			if (!Number.isSafeInteger(block.span) || block.span < 1) {
				issues.push(`Preview blocks: day "${day.id}" event "${block.eventId}" has invalid span "${block.span}"`);
				return;
			}
			if (startIndex + block.span > previewData.slots.length) {
				issues.push(`Preview blocks: day "${day.id}" event "${block.eventId}" span exceeds slot range`);
				return;
			}
			for (let offset = 0; offset < block.span; offset += 1) {
				const slot = previewData.slots[startIndex + offset];
				if (occupiedSlots.has(slot)) {
					issues.push(`Preview blocks: day "${day.id}" has overlapping block at "${slot}"`);
				}
				occupiedSlots.add(slot);
			}
		});
	});

	return issues;
};

export const collectScheduleText = (data: ScheduleData): string => {
	const parts: string[] = [];
	for (const session of data.sessions) {
		parts.push(
			String(session.id),
			session.room,
			session.type,
			session.start,
			session.end,
			session.duration,
			session.zh.title,
			session.zh.description,
			session.en.title,
			session.en.description,
			session.slide ?? "",
			session.qa ?? "",
			session.co_write ?? "",
			session.live ?? "",
			session.broadcast ?? "",
			session.record ?? "",
			session.language ?? "",
			session.uri ?? "",
			...session.speakers,
			...session.tags
		);
	}
	for (const speaker of data.speakers) parts.push(speaker.id, speaker.avatar, speaker.zh.name, speaker.zh.bio, speaker.en.name, speaker.en.bio);
	for (const sessionType of data.session_types) parts.push(sessionType.id, sessionType.note ?? "", sessionType.zh.name, sessionType.zh.description, sessionType.en.name, sessionType.en.description);
	for (const room of data.rooms) parts.push(room.id, room.zh.name, room.zh.description, room.en.name, room.en.description);
	for (const tag of data.tags) parts.push(tag.id, tag.zh.name, tag.zh.description, tag.en.name, tag.en.description);
	return parts.join("\n");
};

export const getScheduleSheetNames = (): ScheduleSheetName[] => [...sheetOrder];

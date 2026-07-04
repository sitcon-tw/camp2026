export type ScheduleDayType = "opening" | "software" | "artificial-intelligence" | "security" | "closing";

export interface ScheduleMeta {
	title: string;
	description: string;
	note?: string;
}

export interface ScheduleDayConfig {
	title: string[];
	date: string;
	subtitle: string;
	type: ScheduleDayType;
}

export interface ScheduleImageConfig {
	key: string;
	alt: string;
}

export const scheduleMeta: ScheduleMeta = {
	title: "活動日程",
	description: "SITCON Camp 2026 將圍繞軟體工程、人工智慧與資訊安全三大主線展開，並穿插交流、實作與活動。"
};

export const scheduleDayConfigs: Record<string, ScheduleDayConfig> = {
	Day1: {
		title: ["主線課程", "先導日"],
		date: "7/8",
		subtitle: "Day 1",
		type: "opening"
	},
	Day2: {
		title: ["軟體工程", "主題日"],
		date: "7/9",
		subtitle: "Day 2",
		type: "software"
	},
	Day3: {
		title: ["人工智慧", "主題日"],
		date: "7/10",
		subtitle: "Day 3",
		type: "artificial-intelligence"
	},
	Day4: {
		title: ["資訊安全", "主題日"],
		date: "7/11",
		subtitle: "Day 4",
		type: "security"
	},
	Day5: {
		title: ["資訊交流", "探索日"],
		date: "7/12",
		subtitle: "Day 5",
		type: "closing"
	}
};

export const dayAccentClassMap: Record<ScheduleDayType, string> = {
	opening: "schedule-day--sky",
	software: "schedule-day--green",
	"artificial-intelligence": "schedule-day--orange",
	security: "schedule-day--blue",
	closing: "schedule-day--dark"
};

export type ScheduleEventCategory = "啟程" | "主線課程" | "活動" | "生活" | "其他" | "總結";

export const scheduleCategoryColorClassMap: Record<ScheduleEventCategory, string> = {
	啟程: "schedule-badge--green",
	主線課程: "schedule-badge--blue",
	活動: "schedule-badge--orange",
	生活: "schedule-badge--sky",
	其他: "schedule-badge--lavender",
	總結: "schedule-badge--dark"
};

export const sessionTypeBadgeClassMap: Record<string, string> = {
	...scheduleCategoryColorClassMap
};

export const fallbackSessionTypeBadgeClass = scheduleCategoryColorClassMap.其他;

export const scheduleImageAliases: Record<string, ScheduleImageConfig> = {
	opening: { key: "start-and-opening", alt: "SITCON Camp 開幕現場" },
	"web-system-intro": { key: "agent-battle", alt: "學員操作著電腦" },
	"ml-main": { key: "ai-main", alt: "人工智慧主題日課程現場" },
	"open-source-sharing": { key: "learning-wrap", alt: "開源理念分享" },
	"sigs-ak": { key: "roundtable-discussion", alt: "學員在專題圓桌討論會中交流討論" }
};

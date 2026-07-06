export interface LocalizedText {
	title?: string;
	name?: string;
	description?: string;
	bio?: string;
}

export interface ScheduleSession {
	id: string;
	type: string;
	room: string;
	start: string;
	end: string;
	zh: {
		title: string;
		description: string;
	};
	en: {
		title: string;
		description: string;
	};
	speakers: string[];
	tags: string[];
	broadcast?: string[];
	slide?: string;
	co_write?: string;
	record?: string;
	[key: string]: unknown;
}

export interface ScheduleSpeaker {
	id: string;
	avatar?: string;
	zh: {
		name: string;
		bio: string;
	};
	en: {
		name: string;
		bio: string;
	};
	[key: string]: unknown;
}

export interface ScheduleSessionType {
	id: string;
	zh: {
		name: string;
		description: string;
	};
	en: {
		name: string;
		description: string;
	};
	[key: string]: unknown;
}

export interface ScheduleRoom {
	id: string;
	zh: {
		name: string;
		description: string;
	};
	en: {
		name: string;
		description: string;
	};
	[key: string]: unknown;
}

export interface ScheduleTag {
	id: string;
	zh: {
		name: string;
		description: string;
	};
	en: {
		name: string;
		description: string;
	};
	[key: string]: unknown;
}

export interface ScheduleData {
	sessions: ScheduleSession[];
	speakers: ScheduleSpeaker[];
	session_types: ScheduleSessionType[];
	rooms: ScheduleRoom[];
	tags: ScheduleTag[];
}

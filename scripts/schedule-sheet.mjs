import { extractGoogleVisualizationJson, getScheduleSheetNames, googleVisualizationResponseToValues, SCHEDULE_SHEET_RANGES, SCHEDULE_SPREADSHEET_ID } from "../src/lib/schedule.ts";

const SHEET_REQUEST_TIMEOUT_MS = 15000;

async function fetchScheduleSheetEntry(sheetName) {
	const url = new URL(`https://docs.google.com/spreadsheets/d/${SCHEDULE_SPREADSHEET_ID}/gviz/tq`);
	url.searchParams.set("tqx", "out:json");
	url.searchParams.set("headers", "1");
	url.searchParams.set("sheet", sheetName);
	url.searchParams.set("range", SCHEDULE_SHEET_RANGES[sheetName]);

	const controller = new AbortController();
	let didTimeout = false;
	const timeout = setTimeout(() => {
		didTimeout = true;
		controller.abort();
	}, SHEET_REQUEST_TIMEOUT_MS);

	try {
		const response = await fetch(url, { signal: controller.signal });
		if (!response.ok) {
			throw new Error(`Google Sheets returned ${response.status}`);
		}

		const json = extractGoogleVisualizationJson(await response.text());
		return [sheetName, googleVisualizationResponseToValues(json)];
	} catch (error) {
		const message = didTimeout ? `Google Sheets request timed out after ${SHEET_REQUEST_TIMEOUT_MS}ms` : error instanceof Error ? error.message : String(error);
		throw new Error(`${sheetName}: ${message}`, { cause: error });
	} finally {
		clearTimeout(timeout);
	}
}

export async function fetchScheduleSheetValues() {
	const entries = await Promise.all(getScheduleSheetNames().map(fetchScheduleSheetEntry));

	return Object.fromEntries(entries);
}

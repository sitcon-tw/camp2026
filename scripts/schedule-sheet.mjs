import { extractGoogleVisualizationJson, getScheduleSheetNames, googleVisualizationResponseToValues, SCHEDULE_SHEET_RANGES, SCHEDULE_SPREADSHEET_ID } from "../src/lib/schedule.ts";

export async function fetchScheduleSheetValues() {
	const entries = await Promise.all(
		getScheduleSheetNames().map(async sheetName => {
			const url = new URL(`https://docs.google.com/spreadsheets/d/${SCHEDULE_SPREADSHEET_ID}/gviz/tq`);
			url.searchParams.set("tqx", "out:json");
			url.searchParams.set("headers", "1");
			url.searchParams.set("sheet", sheetName);
			url.searchParams.set("range", SCHEDULE_SHEET_RANGES[sheetName]);

			const response = await fetch(url);
			if (!response.ok) {
				throw new Error(`${sheetName}: Google Sheets returned ${response.status}`);
			}

			const json = extractGoogleVisualizationJson(await response.text());
			return [sheetName, googleVisualizationResponseToValues(json)];
		})
	);

	return Object.fromEntries(entries);
}

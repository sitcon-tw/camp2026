const BASE_PATH = "/2026";

export default {
	async fetch(request, env) {
		const url = new URL(request.url);

		if (url.pathname === BASE_PATH || url.pathname.startsWith(`${BASE_PATH}/`)) {
			const assetUrl = new URL(request.url);
			assetUrl.pathname = url.pathname.slice(BASE_PATH.length) || "/";

			return env.ASSETS.fetch(new Request(assetUrl, request));
		}

		return env.ASSETS.fetch(request);
	}
};

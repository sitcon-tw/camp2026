declare module "markdown-it" {
	class MarkdownIt {
		constructor(options?: Record<string, unknown>);
		render(src: string): string;
	}

	export default MarkdownIt;
}

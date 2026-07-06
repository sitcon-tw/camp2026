import MarkdownIt from "markdown-it";

const md = new MarkdownIt({ html: true, linkify: true });

type MarkdownToken = ReturnType<MarkdownIt["parse"]>[number];

const collectPlainText = (tokens: MarkdownToken[]): string[] =>
	tokens.flatMap(token => {
		if (token.children) return collectPlainText(token.children);

		if (token.type === "text" || token.type === "code_inline") return [token.content];
		if (token.type === "softbreak" || token.type === "hardbreak") return [" "];

		return [];
	});

export const renderMarkdown = (text: string) => md.render(text);

export const markdownToPlainText = (text: string) => collectPlainText(md.parse(text, {})).join(" ").replace(/\s+/g, " ").trim();

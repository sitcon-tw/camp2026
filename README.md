# SITCON Camp 2026

SITCON Camp 2026 官方網站。專案使用 Astro 建置靜態頁面，搭配 Tailwind CSS、Lucide Icons，以及 GSAP / Anime.js 處理動態效果。

正式站台設定在 `https://sitcon.camp/2026`，相關設定位於 [astro.config.mjs](astro.config.mjs)。

## 環境需求

- Node.js `>=22.12.0`
- pnpm

請固定使用 `pnpm` 作為套件管理工具，避免混用 `npm`、`yarn` 或其他 package manager。

## 開始開發

1. 安裝套件

```bash
pnpm install
```

2. 啟動開發伺服器

```bash
pnpm run dev
```

Astro 預設會在 `http://localhost:4321` 啟動開發伺服器。

3. 設定 Git hooks

```bash
git config core.hooksPath .githooks
```

目前 pre-commit hook 會依序執行：

- `pnpm build`
- `pnpm lint`
- `pnpm prettier:write`

如果 Prettier 有改動檔案，commit 會中止，請確認格式化結果並重新 stage 後再 commit。

## 開發規範

- 主要頁面放在 `src/pages/`，共用區塊拆到 `src/components/`。
- 全站共用外框放在 `src/layouts/Layout.astro`。
- 全域樣式與 Tailwind theme token 放在 `src/styles/global.css`。
- 可使用 `@/`、`@components/`為 import alias，設定位於 [tsconfig.json](tsconfig.json)。
- 圖片、字型等專案資源請放在 `src/assets/`，圖片請使用 Astro 的 `<Image />` 元件。
- 字型由 `astro.config.mjs` 的 `fonts` 設定導入，全站預設字體在 `src/styles/global.css` 套用。
- 顏色請使用 `src/styles/global.css` 中定義的 theme token。
- Icon 優先使用 `@lucide/astro`。
- 動畫可依需求使用 GSAP 或 Anime.js。

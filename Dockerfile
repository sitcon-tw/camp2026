FROM node:24-alpine AS deps
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN SHARP_IGNORE_GLOBAL_LIBVIPS=1 pnpm install --frozen-lockfile

FROM node:24-alpine AS builder
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN SHARP_IGNORE_GLOBAL_LIBVIPS=1 pnpm build

FROM node:24-alpine AS runner
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package.json astro.config.mjs ./
EXPOSE 4321
CMD ["node", "node_modules/.bin/astro", "preview", "--host", "0.0.0.0", "--port", "4321"]

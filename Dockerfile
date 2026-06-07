FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN SHARP_IGNORE_GLOBAL_LIBVIPS=1 pnpm install --frozen-lockfile

COPY . .
RUN SHARP_IGNORE_GLOBAL_LIBVIPS=1 pnpm build

FROM node:22-alpine

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY --from=builder /app/node_modules/ ./node_modules/
COPY --from=builder /app/dist/ ./dist/
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml astro.config.mjs ./

EXPOSE 4321

CMD ["pnpm", "start"]

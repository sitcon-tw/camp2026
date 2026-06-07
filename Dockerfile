FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN SHARP_IGNORE_GLOBAL_LIBVIPS=1 pnpm install --frozen-lockfile

COPY . .
RUN SHARP_IGNORE_GLOBAL_LIBVIPS=1 pnpm build

FROM node:22-alpine

RUN corepack enable && corepack prepare pnpm@latest --activate && pnpm add -g serve

COPY --from=builder /app/dist/ /app/dist/

EXPOSE 4321

CMD ["serve", "-s", "/app/dist", "-l", "4321"]

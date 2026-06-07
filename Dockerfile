FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN SHARP_IGNORE_GLOBAL_LIBVIPS=1 pnpm install --frozen-lockfile

COPY . .
RUN SHARP_IGNORE_GLOBAL_LIBVIPS=1 pnpm build

FROM node:22-alpine

RUN npm install -g serve

COPY --from=builder /app/dist/ /app/serve/2026/

EXPOSE 4321

CMD ["serve", "-s", "/app/serve", "-l", "4321"]

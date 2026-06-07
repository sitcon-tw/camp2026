FROM node:24-alpine

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY . .

RUN SHARP_IGNORE_GLOBAL_LIBVIPS=1 pnpm install --frozen-lockfile

RUN SHARP_IGNORE_GLOBAL_LIBVIPS=1 pnpm build

EXPOSE 4321

CMD ["pnpm", "start"]

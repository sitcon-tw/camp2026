FROM node:22-alpine

RUN corepack enable && corepack prepare pnpm@latest --activate && pnpm add -g serve

COPY dist/ /app/dist/

EXPOSE 4321

CMD ["serve", "-s", "/app/dist", "-l", "4321"]

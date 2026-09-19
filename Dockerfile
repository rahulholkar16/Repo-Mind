FROM oven/bun:1-alpine AS builder

WORKDIR /app

COPY package.json bun.lock ./

COPY prisma ./prisma

RUN bun install --frozen-lockfile

COPY . .

ARG DATABASE_URL

ENV DATABASE_URL=${DATABASE_URL}

RUN bunx prisma generate

RUN bun run build

FROM oven/bun:1-alpine AS runner


ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["bun", "server.js"]
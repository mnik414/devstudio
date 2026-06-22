FROM node:22-alpine AS base
RUN apk add --no-cache openssl

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN rm -f .env

ENV DATABASE_URL="file:/app/seed-dev.db"

RUN npx prisma generate
RUN npx prisma db push --accept-data-loss

RUN npx tsx src/lib/seed.ts

RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV DATABASE_URL="file:/data/prisma/dev.db"

RUN apk add --no-cache su-exec

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

COPY --from=builder /app/prisma ./prisma

COPY --from=builder /app/seed-dev.db /app/seed-dev.db

RUN mkdir -p /data/prisma /app/public/uploads && chown -R nextjs:nodejs /data/prisma /app/public/uploads /app/node_modules

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["docker-entrypoint.sh"]
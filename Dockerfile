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

# Remove the local .env so it doesn't override our build-time DATABASE_URL
RUN rm -f .env

# Use an absolute, fixed path for the database – avoids any confusion with subfolders
ENV DATABASE_URL="file:/app/seed-dev.db"

RUN npx prisma generate
RUN npx prisma db push --accept-data-loss

# Seed the database (exits cleanly – no timeout needed)
RUN npx tsx src/lib/seed.ts

# The seeded database is now at /app/seed-dev.db
RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV DATABASE_URL="file:/data/prisma/dev.db"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copy the Prisma schema (needed for runtime db push)
COPY --from=builder /app/prisma ./prisma

# Copy the pre-seeded database
COPY --from=builder /app/seed-dev.db /app/seed-dev.db

RUN mkdir -p /data/prisma /app/public/uploads && chown -R nextjs:nodejs /data/prisma /app/public/uploads /app/node_modules

USER nextjs
EXPOSE 3000

# On first run, copy the seeded database to the persistent volume
# Then synchronize the schema and start Next.js
CMD ["sh", "-c", "cp -n /app/seed-dev.db /data/prisma/dev.db && chown -R nextjs:nodejs /app/public/uploads && npx prisma@6 db push --schema=/app/prisma/schema.prisma && node server.js"]

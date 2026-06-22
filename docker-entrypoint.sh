#!/bin/sh
set -e

cp -n /app/seed-dev.db /data/prisma/dev.db

chown -R nextjs:nodejs /app/public/uploads /data/prisma

npx prisma@6 db push --schema=/app/prisma/schema.prisma

exec su-exec nextjs:nodejs node server.js
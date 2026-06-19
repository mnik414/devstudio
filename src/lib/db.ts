import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  __prismaCacheKey?: string
}

// The cache key includes a timestamp that we bump when schema changes.
// To bust the cache after a schema change, increment this value.
const CACHE_KEY = 'v2-newsletter'

export const db =
  globalForPrisma.__prismaCacheKey === CACHE_KEY && globalForPrisma.prisma
    ? globalForPrisma.prisma
    : new PrismaClient({
        log: ['error', 'warn'],
      })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db
  globalForPrisma.__prismaCacheKey = CACHE_KEY
}

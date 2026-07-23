import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

function createPrisma() {
  const url = process.env.DATABASE_URL
  const connectionUrl = url?.includes("?")
    ? url + "&connection_limit=5&pool_timeout=10&connect_timeout=10"
    : url + "?connection_limit=5&pool_timeout=10&connect_timeout=10"

  return new PrismaClient({
    datasources: { db: { url: connectionUrl } },
    log: process.env.NODE_ENV === "development" ? ["query"] : undefined,
  })
}

export const prisma = globalForPrisma.prisma ?? createPrisma()
globalForPrisma.prisma = prisma

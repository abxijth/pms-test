import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

function createPrisma() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query"] : undefined,
  })
}

export const prisma = globalForPrisma.prisma ?? createPrisma()
globalForPrisma.prisma = prisma

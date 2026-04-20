import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// 1. Create the adapter using your Neon DB URL
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!
})

// 2. Pass the adapter to the PrismaClient constructor
export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
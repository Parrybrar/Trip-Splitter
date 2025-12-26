import { PrismaClient } from '@prisma/client';
//this prevents multiple conncetions during "hot reloading " in dev
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;

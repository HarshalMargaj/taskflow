import { PrismaClient } from "@prisma/client";
// Keep this as is, it's just a type declaration
declare global {
	// Keep this as is, it's just a type declaration
	var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalThis.prisma = db;

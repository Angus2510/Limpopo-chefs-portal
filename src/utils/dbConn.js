import { PrismaClient } from "@prisma/client";

// Singleton Prisma Client to prevent multiple instantiations
const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === "development") {
  global.prisma = prisma; // Save to global for hot reloading in dev
}

async function dbConnect() {
  if (prisma) {
    console.log("Prisma database client is already connected.");
    return prisma; // Return the Prisma client instance
  }

  try {
    // Here, we connect manually to ensure it's ready for use
    console.log("Connecting to Prisma database...");
    await prisma.$connect();
    console.log("Prisma connected successfully.");
    return prisma;
  } catch (error) {
    console.error("Database connection failed:", error.message);
    throw error;
  }
}

export default dbConnect;

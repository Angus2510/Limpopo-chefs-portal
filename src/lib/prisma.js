const { PrismaClient } = require("@prisma/client");

let prisma;

// Ensure the Prisma client is a singleton in a hot-reloading environment like Next.js
if (!global.prisma) {
  global.prisma = new PrismaClient();
}
prisma = global.prisma;

module.exports = prisma;

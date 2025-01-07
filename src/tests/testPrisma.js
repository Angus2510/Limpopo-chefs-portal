const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // Example: Fetch data from a specific model
  const students = await prisma.students.findMany();
  console.log("Students:", students);
}

main()
  .then(() => prisma.$disconnect())
  .catch((error) => {
    console.error("Error:", error);
    prisma.$disconnect();
    process.exit(1);
  });

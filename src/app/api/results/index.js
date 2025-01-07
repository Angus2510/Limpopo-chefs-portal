import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const results = await prisma.results.findMany({
          skip: parseInt(skip),
          take: parseInt(limit),
          include: {
            results: true,
            campus: true,
            intakeGroups: true,
            outcome: true,
          },
          orderBy: {
            conductedOn: "desc",
          },
        });

        const total = await prisma.results.count();

        res.status(200).json({
          results,
          totalPages: Math.ceil(total / limit),
          currentPage: page,
        });
      } catch (error) {
        console.error("Error fetching results:", error);
        res.status(500).json({ error: "Failed to fetch results" });
      }
      break;

    case "POST":
      try {
        const newResult = await prisma.results.create({
          data: {
            ...req.body,
            conductedOn: new Date(req.body.conductedOn),
            v: 0,
          },
          include: {
            results: true,
          },
        });

        res.status(201).json(newResult);
      } catch (error) {
        console.error("Error creating result:", error);
        res.status(500).json({ error: "Failed to create result" });
      }
      break;

    case "PUT":
      try {
        const { id, ...updateData } = req.body;
        const updatedResult = await prisma.results.update({
          where: { id },
          data: updateData,
          include: {
            results: true,
          },
        });

        res.status(200).json(updatedResult);
      } catch (error) {
        console.error("Error updating result:", error);
        res.status(500).json({ error: "Failed to update result" });
      }
      break;

    case "DELETE":
      try {
        const { id } = req.query;
        await prisma.results.delete({
          where: { id },
        });

        res.status(200).json({ message: "Result deleted successfully" });
      } catch (error) {
        console.error("Error deleting result:", error);
        res.status(500).json({ error: "Failed to delete result" });
      }
      break;

    default:
      res.status(405).json({ error: "Method not allowed" });
  }

  await prisma.$disconnect();
}

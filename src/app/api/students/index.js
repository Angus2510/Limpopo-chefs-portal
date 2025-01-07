import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const students = await prisma.students.findMany({
        include: {
          campus: true,
          intakeGroup: true,
        },
      });
      return res.status(200).json(students);
    } catch (error) {
      console.error("Error fetching students:", error);
      return res.status(500).json({ error: "Failed to fetch students." });
    }
  }
  return res.status(405).json({ error: "Method not allowed" });
}

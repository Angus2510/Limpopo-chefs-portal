import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { students, date, campus, intakeGroup } = req.body;

  if (!students || !date || !campus || !intakeGroup) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Format attendees data
      const attendees = students.map((student) => ({
        id: crypto.randomUUID(),
        student: student.id,
        status: student.status,
        timeCheckedIn: student.timeCheckedIn || null,
      }));

      // Create new attendance record
      const attendance = await tx.attendances.create({
        data: {
          attendanceDate: new Date(date),
          campus: campus,
          intakeGroup: intakeGroup,
          type: "WEL",
          attendees: attendees,
          v: 0,
        },
      });

      return attendance;
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error creating WEL attendance:", error);
    res.status(500).json({ error: "Failed to create attendance record" });
  } finally {
    await prisma.$disconnect();
  }
}

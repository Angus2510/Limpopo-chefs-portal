import prisma from "../../../utils/dbConn"; // Assuming your Prisma client is in dbConn.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ error: `Method '${req.method}' Not Allowed` });
  }

  const { studentId, newIntakeGroupId } = req.body;

  if (!studentId || !newIntakeGroupId) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  // Start a transaction with Prisma
  const transaction = await prisma.$transaction(async (prisma) => {
    try {
      // Fetch the student and intake group in a transaction
      const student = await prisma.student.findUnique({
        where: { id: studentId },
      });

      if (!student) {
        throw new Error("Student not found");
      }

      const newIntakeGroup = await prisma.intakeGroup.findUnique({
        where: { id: newIntakeGroupId },
      });

      if (!newIntakeGroup) {
        throw new Error("Intake group not found");
      }

      // Update the student's intake group
      const updatedStudent = await prisma.student.update({
        where: { id: studentId },
        data: { intakeGroup: newIntakeGroupId },
      });

      return updatedStudent; // Return the updated student
    } catch (error) {
      throw error; // If an error occurs, it will be caught and handled below
    }
  });

  // Handle the result or error after the transaction
  try {
    res
      .status(200)
      .json({
        message: "Intake group changed successfully",
        student: transaction,
      });
  } catch (error) {
    console.error("Error changing intake group:", error);
    res.status(500).json({ error: "Error changing intake group" });
  }
}

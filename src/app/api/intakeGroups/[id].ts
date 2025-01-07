import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query; // Get intake group ID from the URL

  if (req.method === "GET") {
    try {
      const intakeGroup = await prisma.intakegroups.findUnique({
        where: { id: String(id) }, // Find intake group by ID
      });
      if (!intakeGroup) {
        return res.status(404).json({ error: "Intake Group not found" });
      }
      res.status(200).json(intakeGroup); // Respond with the intake group
    } catch (error) {
      res.status(500).json({ error: "Error fetching intake group" });
    }
  } else if (req.method === "PATCH") {
    try {
      // Ensure the request body contains the required fields: title, campus, outcome, and v
      const { title, campus, outcome, v } = req.body;

      if (typeof v !== "number") {
        return res
          .status(400)
          .json({ error: "'v' field is required and must be a number" });
      }

      const updatedIntakeGroup = await prisma.intakegroups.update({
        where: { id: String(id) }, // Find intake group by ID
        data: { title, campus, outcome, v }, // Update with the request body data
      });

      res.status(200).json(updatedIntakeGroup); // Respond with the updated intake group
    } catch (error) {
      res.status(500).json({ error: "Error updating intake group" });
    }
  } else if (req.method === "DELETE") {
    try {
      await prisma.intakegroups.delete({
        where: { id: String(id) }, // Delete intake group by ID
      });
      res.status(204).end(); // No content on success
    } catch (error) {
      res.status(500).json({ error: "Error deleting intake group" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

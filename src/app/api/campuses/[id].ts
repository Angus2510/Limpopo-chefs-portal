import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query; // Get the campus ID from the URL

  if (req.method === "GET") {
    try {
      const campus = await prisma.campus.findUnique({
        where: { id: Number(id) }, // Find campus by ID
      });
      if (!campus) {
        return res.status(404).json({ error: "Campus not found" });
      }
      res.status(200).json(campus); // Return the campus
    } catch (error) {
      res.status(500).json({ error: "Error fetching campus" });
    }
  } else if (req.method === "PATCH") {
    try {
      const updatedCampus = await prisma.campus.update({
        where: { id: Number(id) }, // Find campus by ID
        data: req.body, // Update the campus data
      });
      res.status(200).json(updatedCampus); // Return the updated campus
    } catch (error) {
      res.status(500).json({ error: "Error updating campus" });
    }
  } else if (req.method === "DELETE") {
    try {
      await prisma.campus.delete({
        where: { id: Number(id) }, // Delete campus by ID
      });
      res.status(204).end(); // No content on success
    } catch (error) {
      res.status(500).json({ error: "Error deleting campus" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const campuses = await prisma.campus.findMany(); // Use Prisma to fetch all campuses
      res.status(200).json(campuses); // Respond with campuses data
    } catch (error) {
      res.status(500).json({ error: "Error fetching campuses" });
    }
  } else if (req.method === "POST") {
    try {
      const { title } = req.body; // Get title from request body
      const newCampus = await prisma.campus.create({
        data: { title }, // Create a new campus using Prisma
      });
      res.status(201).json(newCampus); // Respond with the newly created campus
    } catch (error) {
      res.status(500).json({ error: "Error creating campus" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

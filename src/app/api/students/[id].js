// pages/api/students/[id].js

import prisma from "../../../lib/prisma"; // Ensure this points to your Prisma client

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    const student = await prisma.student.findUnique({
      where: { id: id },
    });
    return res.status(200).json(student);
  }

  if (req.method === "PATCH") {
    const { formData } = req.body;
    const updatedStudent = await prisma.student.update({
      where: { id: id },
      data: formData,
    });
    return res.status(200).json(updatedStudent);
  }

  if (req.method === "DELETE") {
    await prisma.student.delete({
      where: { id: id },
    });
    return res.status(204).end();
  }

  res.status(405).json({ error: "Method Not Allowed" });
}

import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { path, roles, action } = req.body;

  try {
    const rolesData = await prisma.roles.findMany();
    const roleAccess = rolesData.find((r) => r.path === path);

    if (!roleAccess) {
      return res.status(403).json({ hasAccess: false });
    }

    const hasAccess = roleAccess.actions[action]?.some((role) =>
      roles.includes(role)
    );
    return res.status(200).json({ hasAccess });
  } catch (error) {
    console.error("[API] Access check failed:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

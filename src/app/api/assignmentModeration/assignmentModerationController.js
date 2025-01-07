import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createModeration(req, res) {
  const { assignmentId, assignmentResultId, moderationEntries } = req.body;
  const { staffId } = req.query;

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Create moderation entries
      const formattedEntries = moderationEntries.map((entry) => ({
        id: crypto.randomUUID(),
        question: entry.question,
        answer: entry.answer,
        moderatedMark: entry.moderatedMark,
        lecturer: staffId,
        date: new Date(),
      }));

      // Create moderation record
      const moderation = await tx.assignmentmoderations.create({
        data: {
          assignment: assignmentId,
          assignmentResult: assignmentResultId,
          moderatedBy: staffId,
          moderationEntries: formattedEntries,
          createdAt: new Date(),
          updatedAt: new Date(),
          v: 0,
        },
        include: {
          moderationEntries: true,
        },
      });

      // Update assignment result status
      await tx.assignmentresults.update({
        where: { id: assignmentResultId },
        data: {
          status: "Moderated",
        },
      });

      return moderation;
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error creating moderation:", error);
    res.status(500).json({ error: "Failed to create moderation" });
  } finally {
    await prisma.$disconnect();
  }
}

export async function getModeration(req, res) {
  const { moderationId } = req.query;

  try {
    const moderation = await prisma.assignmentmoderations.findUnique({
      where: { id: moderationId },
      include: {
        moderationEntries: true,
      },
    });

    if (!moderation) {
      return res.status(404).json({ error: "Moderation not found" });
    }

    res.status(200).json(moderation);
  } catch (error) {
    console.error("Error fetching moderation:", error);
    res.status(500).json({ error: "Failed to fetch moderation" });
  } finally {
    await prisma.$disconnect();
  }
}

export async function updateModeration(req, res) {
  const { moderationId } = req.query;
  const { moderationEntries } = req.body;

  try {
    const result = await prisma.assignmentmoderations.update({
      where: { id: moderationId },
      data: {
        moderationEntries: moderationEntries,
        updatedAt: new Date(),
      },
      include: {
        moderationEntries: true,
      },
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error updating moderation:", error);
    res.status(500).json({ error: "Failed to update moderation" });
  } finally {
    await prisma.$disconnect();
  }
}

export async function deleteModeration(req, res) {
  const { moderationId } = req.query;

  try {
    await prisma.assignmentmoderations.delete({
      where: { id: moderationId },
    });

    res.status(200).json({ message: "Moderation deleted successfully" });
  } catch (error) {
    console.error("Error deleting moderation:", error);
    res.status(500).json({ error: "Failed to delete moderation" });
  } finally {
    await prisma.$disconnect();
  }
}

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createIntakeGroup() {
  const newIntakeGroup = {
    title: "New Intake Group", // Example title
    campus: ["Campus1", "Campus2"],
    outcome: ["Outcome1", "Outcome2"],
    v: 0, // Setting default value for the `v` field
  };

  try {
    const intakeGroup = await prisma.intakegroups.create({
      data: newIntakeGroup,
    });
    console.log("Intake group created:", intakeGroup);
  } catch (error) {
    console.error("Error creating intake group:", error);
  }
}

createIntakeGroup();

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Function to find the user by ID based on user type
async function findUserById(userId, userType) {
  let user;

  switch (userType) {
    case "staff":
      user = await prisma.staffs.findUnique({ where: { id: userId } });
      break;
    case "guardian":
      user = await prisma.guardians.findUnique({ where: { id: userId } });
      break;
    case "student":
      user = await prisma.students.findUnique({ where: { id: userId } });
      break;
    default:
      user = null;
  }

  return user ? { user, userType } : null;
}

export async function POST(req) {
  const { userId, userType } = await req.json(); // Parsing JSON from the request body

  console.log("Accept Agreement Request:", { userId, userType });

  // Find the user using the Prisma client
  const result = await findUserById(userId, userType);

  if (!result) {
    return new Response(JSON.stringify({ message: "User not found" }), {
      status: 404,
    });
  }

  const { user } = result;

  console.log("User found:", user);

  // Now handle the update by manually accessing the correct model based on userType
  let updatedUser;
  switch (userType) {
    case "staff":
      updatedUser = await prisma.staffs.update({
        where: { id: user.id },
        data: {
          agreementAccepted: true,
          agreementAcceptedDate: new Date(),
        },
      });
      break;
    case "guardian":
      updatedUser = await prisma.guardians.update({
        where: { id: user.id },
        data: {
          agreementAccepted: true,
          agreementAcceptedDate: new Date(),
        },
      });
      break;
    case "student":
      updatedUser = await prisma.students.update({
        where: { id: user.id },
        data: {
          agreementAccepted: true,
          agreementAcceptedDate: new Date(),
        },
      });
      break;
    default:
      return new Response(JSON.stringify({ message: "Invalid user type" }), {
        status: 400,
      });
  }

  console.log("User agreement accepted and saved:", updatedUser);

  return new Response(JSON.stringify({ message: "User agreement accepted" }), {
    status: 200,
  });
}

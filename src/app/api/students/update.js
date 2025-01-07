import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { generateRandomPassword } from "../../../middleware/randomPasswordMiddleware";
import nextConnect from "next-connect";

const prisma = new PrismaClient();

const handler = nextConnect();

handler.patch(async (req, res) => {
  const { id } = req.query;
  const {
    admissionNumber,
    email,
    firstName,
    middleName,
    lastName,
    gender,
    dateOfBirth,
    idNumber,
    mobileNumber,
    homeLanguage,
    cityAndGuildNumber,
    admissionDate,
    accommodation,
    qualification,
    address,
    postalAddress,
  } = req.body;

  // Handling the file upload
  const photoUrl = req.body.photoUrl;

  // Handling nested guardians data
  const guardians = Array.isArray(req.body.guardians) ? req.body.guardians : [];

  if (
    !id ||
    !admissionNumber ||
    !firstName ||
    !idNumber ||
    !dateOfBirth ||
    !gender
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const session = await prisma.$transaction();

  try {
    const student = await prisma.student.findUnique({
      where: { id: id },
      include: {
        guardians: true,
      },
    });

    if (!student) {
      await session.$rollback();
      return res.status(404).json({ message: "Student not found" });
    }

    const duplicate = await prisma.student.findFirst({
      where: {
        admissionNumber,
        NOT: {
          id: id,
        },
      },
    });

    if (duplicate) {
      throw new Error("Duplicate admission number found");
    }

    // Check if the accommodation has changed
    const oldAccommodation = await prisma.accommodation.findFirst({
      where: {
        occupants: {
          some: {
            id: student.id,
          },
        },
      },
    });
    const newAccommodation = accommodation
      ? await prisma.accommodation.findUnique({
          where: {
            id: accommodation,
          },
        })
      : null;

    if (
      newAccommodation &&
      (!oldAccommodation || oldAccommodation.id !== newAccommodation.id)
    ) {
      // Remove student from old accommodation
      if (oldAccommodation) {
        await prisma.accommodation.update({
          where: {
            id: oldAccommodation.id,
          },
          data: {
            occupants: {
              disconnect: { id: student.id },
            },
          },
        });
      }

      // Add student to new accommodation
      await prisma.accommodation.update({
        where: { id: newAccommodation.id },
        data: {
          occupants: {
            connect: { id: student.id },
          },
        },
      });
    }

    // Update student details
    await prisma.student.update({
      where: { id: student.id },
      data: {
        admissionNumber,
        email,
        qualification,
        profile: {
          update: {
            firstName,
            middleName,
            lastName,
            gender,
            dateOfBirth,
            idNumber,
            mobileNumber,
            homeLanguage,
            cityAndGuildNumber,
            admissionDate,
            avatar: photoUrl || student.profile.avatar, // Update photo only if provided
            address: {
              update: {
                street1: address.street1,
                street2: address.street2,
                city: address.city,
                province: address.province,
                country: address.country,
                postalCode: address.postalCode,
              },
            },
            postalAddress: {
              update: {
                street1: postalAddress.street1,
                street2: postalAddress.street2,
                city: postalAddress.city,
                province: postalAddress.province,
                country: postalAddress.country,
                postalCode: postalAddress.postalCode,
              },
            },
          },
        },
      },
    });

    // Identify and remove deleted guardians
    const existingGuardianIds = student.guardians.map((guardian) =>
      guardian.id.toString()
    );
    const updatedGuardianIds = guardians
      .map((guardian) => guardian._id)
      .filter((id) => id);

    const guardiansToRemove = existingGuardianIds.filter(
      (id) => !updatedGuardianIds.includes(id)
    );
    await prisma.guardian.deleteMany({
      where: { id: { in: guardiansToRemove } },
    });

    // Handling guardians update
    let newGuardians = [];
    if (guardians.length > 0) {
      for (let i = 0; i < guardians.length; i++) {
        const guardianData = guardians[i];
        if (guardianData.firstName && guardianData.lastName) {
          if (guardianData._id) {
            // Update existing guardian
            const guardian = await prisma.guardian.findUnique({
              where: { id: guardianData._id },
            });
            if (guardian) {
              await prisma.guardian.update({
                where: { id: guardian.id },
                data: {
                  firstName: guardianData.firstName || guardian.firstName,
                  lastName: guardianData.lastName || guardian.lastName,
                  relation: guardianData.relation || guardian.relation,
                  mobileNumber:
                    guardianData.mobileNumber || guardian.mobileNumber,
                },
              });
            }
          } else {
            // Add new guardian
            const guardianPassword = generateRandomPassword(10);
            const hashedGuardianPassword = await bcrypt.hash(
              guardianPassword,
              10
            );

            const newGuardian = await prisma.guardian.create({
              data: {
                firstName: guardianData.firstName,
                lastName: guardianData.lastName,
                email: guardianData.email,
                mobileNumber: guardianData.mobileNumber,
                relation: guardianData.relation,
                password: hashedGuardianPassword,
                student: { connect: { id: student.id } },
              },
            });

            student.guardians.push(newGuardian.id);
            newGuardians.push({
              guardian: newGuardian,
              password: guardianPassword,
            });
          }
        }
      }
    }

    await session.$commit();
    res.json({
      message: "Student updated successfully",
      studentId: student.id,
      guardianIds: student.guardians.map((g) => g.id),
    });
  } catch (error) {
    await session.$rollback();
    console.error("Update Student Error:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to update student" });
  }
});

export default handler;

import dbConnect from "../../../utils/dbConnect";
import Student from "../../../models/Student";
import Guardian from "../../../models/Guardian";
import Accommodation from "../../../models/Accommodation";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { generateRandomPassword } from "../../../middleware/randomPasswordMiddleware";
import { sendEmailNotification } from "../../../config/nodeMailerConn";
import nextConnect from "next-connect";

const handler = nextConnect();

handler.post(async (req, res) => {
  await dbConnect();

  const {
    admissionNumber,
    intakeGroup,
    campus,
    firstName,
    middleName,
    lastName,
    gender,
    dateOfBirth,
    idNumber,
    mobileNumber,
    email,
    homeLanguage,
    cityAndGuildNumber,
    admissionDate,
    qualification,
    address,
    postalAddress,
    accommodation, // The ID of the accommodation
  } = req.body;

  const guardians = Array.isArray(req.body.guardians) ? req.body.guardians : [];
  const photo = req.body.photoUrl || null;

  if (!admissionNumber || !firstName || !idNumber) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  let session;
  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const duplicate = await Student.findOne({ admissionNumber }).session(
      session
    );
    if (duplicate) {
      throw new Error("Admission number already in use");
    }

    const studentPassword = generateRandomPassword(10);
    const hashedStudentPassword = await bcrypt.hash(studentPassword, 10);

    const newStudent = new Student({
      username: admissionNumber,
      admissionNumber,
      password: hashedStudentPassword,
      intakeGroup,
      qualification,
      campus,
      email,
      profile: {
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
        avatar: photo,
        address: {
          street1: address.street1,
          street2: address.street2,
          city: address.city,
          province: address.province,
          country: address.country,
          postalCode: address.postalCode,
        },
        postalAddress: {
          street1: postalAddress.street1,
          street2: postalAddress.street2,
          city: postalAddress.city,
          province: postalAddress.province,
          country: postalAddress.country,
          postalCode: postalAddress.postalCode,
        },
      },
    });
    await newStudent.save({ session });

    let newGuardians = [];
    if (guardians.length > 0) {
      for (let i = 0; i < guardians.length; i++) {
        const guardian = guardians[i];
        if (guardian.firstName && guardian.lastName) {
          const guardianPassword = generateRandomPassword(10);
          const hashedGuardianPassword = await bcrypt.hash(
            guardianPassword,
            10
          );

          const newGuardian = new Guardian({
            firstName: guardian.firstName,
            lastName: guardian.lastName,
            email: guardian.email,
            mobileNumber: guardian.phoneNumber,
            relation: guardian.relation,
            password: hashedGuardianPassword,
            student: newStudent._id,
          });
          await newGuardian.save({ session });
          newStudent.guardians.push(newGuardian._id);
          newGuardians.push({
            guardian: newGuardian,
            password: guardianPassword,
          });

          // Use sendEmailNotification function to send email to guardian
          const guardianTitle = "Your Guardian Account Created";
          const guardianMessage = `Username: ${
            guardian.email || guardian.phoneNumber
          }\nPassword: ${guardianPassword}`;
          sendEmailNotification(guardian.email, guardianTitle, guardianMessage);
        }
      }
      await newStudent.save({ session });
    }

    if (accommodation) {
      const accommodationDoc = await Accommodation.findById(
        accommodation
      ).session(session);
      if (accommodationDoc) {
        accommodationDoc.occupants.push(newStudent._id);
        await accommodationDoc.save({ session });
      }
    }

    await session.commitTransaction();

    // Use sendEmailNotification function to send email to student
    const studentTitle = "Your Account Created";
    const studentMessage = `Username: ${admissionNumber}\nPassword: ${studentPassword}`;
    sendEmailNotification(email, studentTitle, studentMessage);

    return res.status(201).json({
      message: "New student added successfully",
      studentId: newStudent._id,
      guardianIds: newGuardians.map((g) => g.guardian._id),
      studentPassword,
      guardianPasswords: newGuardians.map((g) => ({
        guardianId: g.guardian._id,
        password: g.password,
      })),
    });
  } catch (error) {
    console.error("Failed to create new student:", error);
    if (session) {
      await session.abortTransaction();
    }
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  } finally {
    if (session) {
      session.endSession();
    }
  }
});

export default handler;

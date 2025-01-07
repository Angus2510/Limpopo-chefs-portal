const Assignment = require("../models/Assignment");
const { s3, bucketName } = require("../config/s3");
const { v4: uuidv4 } = require("uuid");

// Helper function to upload a file to S3
const uploadToS3 = async (file, folder = "") => {
  const params = {
    Bucket: bucketName,
    Key: `${folder}${folder ? "/" : ""}${uuidv4()}_${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    const data = await s3.upload(params).promise();
    return data.Location;
  } catch (err) {
    throw new Error("Failed to upload file to S3");
  }
};

// Get all assignments
const getAllAssignments = async () => {
  try {
    const assignments = await Assignment.find()
      .populate("intakeGroups")
      .populate("questions")
      .populate("campus")
      .populate("individualStudents")
      .populate("lecturer")
      .populate("outcome");
    return assignments;
  } catch (err) {
    throw new Error("Error fetching assignments");
  }
};

// Create a new assignment
const createAssignment = async (body) => {
  try {
    const randomFiveDigitNumber = Math.floor(
      10000 + Math.random() * 90000
    ).toString();
    const newAssignment = new Assignment({
      ...body,
      availableFrom: new Date(body.availableFrom),
      password: randomFiveDigitNumber,
    });
    await newAssignment.save();
    return newAssignment;
  } catch (err) {
    throw new Error("Error creating assignment");
  }
};

// Get assignment by ID
const getAssignmentById = async (id) => {
  try {
    const assignment = await Assignment.findById(id)
      .populate("intakeGroups")
      .populate("questions")
      .populate("campus")
      .populate("individualStudents")
      .populate("lecturer")
      .populate("outcome");

    if (!assignment) {
      throw new Error("Assignment not found");
    }

    // Replace S3 URLs with local proxy URLs
    assignment.questions.forEach((question) => {
      if (question.type === "Match" && question.options) {
        question.options.forEach((option) => {
          if (
            option.columnA &&
            option.columnA.startsWith(
              "https://limpopochefs.s3.af-south-1.amazonaws.com"
            )
          ) {
            const keyA = option.columnA.split(".com/")[1];
            option.columnA = `https://limpopochefs.vercel.app/api/files/getFile?key=${keyA}`;
          }
          if (
            option.columnB &&
            option.columnB.startsWith(
              "https://limpopochefs.s3.af-south-1.amazonaws.com"
            )
          ) {
            const keyB = option.columnB.split(".com/")[1];
            option.columnB = `https://limpopochefs.vercel.app/api/files/getFile?key=${keyB}`;
          }
        });
      }
    });

    return assignment;
  } catch (err) {
    throw new Error("Error fetching assignment");
  }
};

// Update an assignment by ID
const updateAssignment = async (id, body) => {
  try {
    const updatedAssignment = await Assignment.findByIdAndUpdate(id, body, {
      new: true,
    });
    return updatedAssignment;
  } catch (err) {
    throw new Error("Error updating assignment");
  }
};

// Delete an assignment by ID
const deleteAssignment = async (id) => {
  try {
    await Assignment.findByIdAndDelete(id);
    return { msg: "Assignment deleted" };
  } catch (err) {
    throw new Error("Error deleting assignment");
  }
};

module.exports = {
  uploadToS3,
  getAllAssignments,
  createAssignment,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
};

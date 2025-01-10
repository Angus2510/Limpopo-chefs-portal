import mongoose from "mongoose";
import Student from "../../../lib/models/Student"; // Adjust the path to where your Student model is

const MONGODB_URI = process.env.MONGODB_URI || "your-mongodb-connection-string";

const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    console.log("Using existing database connection");
    return; // Reuse existing connection
  }

  try {
    console.log("Establishing new database connection...");
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully!");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
    throw new Error("MongoDB connection failed");
  }
};

export default async function handler(req, res) {
  try {
    await connectDB(); // Ensure DB connection
    const students = await Student.find(); // Query your Student collection
    res.status(200).json(students); // Return the result
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch students" });
  }
}

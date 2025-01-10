import mongoose from "mongoose";

// MongoDB connection URI (use your actual MongoDB URI here)
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://anguscarey1:Gooseman12!@cluster0.z8l7w.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0";

// Function to test the Mongoose connection
async function testConnection() {
  try {
    // Connect to the MongoDB database
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB successfully!");

    // Optionally: You can try fetching data to verify the connection
    // const students = await Student.find();
    // console.log(students);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
}

// Run the test
testConnection();

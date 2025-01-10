import mongoose from "mongoose";

const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    console.log("Using existing database connection");
    return; // Reuse existing connection
  }

  console.log("Establishing new database connection");
  await mongoose.connect(
    process.env.MONGODB_URI ||
      "mongodb+srv://anguscarey1:Gooseman12!@cluster0.z8l7w.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
};

export default connectDB;

import mongoose from "mongoose";

const qualificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Qualification", qualificationSchema);

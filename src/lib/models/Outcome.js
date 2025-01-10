import mongoose from "mongoose";

const outcomeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    enum: ["Theory", "Practical", "Exams/Well"],
    required: true,
  },

  hidden: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("Outcome", outcomeSchema);

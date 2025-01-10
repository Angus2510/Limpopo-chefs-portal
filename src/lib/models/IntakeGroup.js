import mongoose from "mongoose";

const intakeGroupSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  campus: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campus",
    },
  ],
  outcome: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Outcome",
    },
  ],
});

export default mongoose.model("IntakeGroup", intakeGroupSchema);

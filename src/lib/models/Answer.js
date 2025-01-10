import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Assignment",
    required: true,
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  answer: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },

  scores: {
    type: Number,
  },

  moderatedscores: {
    type: Number,
  },

  matchAnswers: [
    {
      pairOne: String,
      pairTwo: String,
    },
  ],
  answeredAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Answer", answerSchema);

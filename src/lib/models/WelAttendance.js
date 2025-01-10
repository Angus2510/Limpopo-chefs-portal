import mongoose from "mongoose";

const welAttendanceSchema = new mongoose.Schema(
  {
    intakeGroups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "IntakeGroup",
        required: true,
      },
    ],
    campuses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Campus",
        required: true,
      },
    ],
    dateFrom: {
      type: Date,
      required: true,
    },
    dateTo: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("WelAttendance", welAttendanceSchema);

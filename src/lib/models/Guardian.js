import mongoose from "mongoose";

const guardianSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: {
    type: String,
  },
  mobileNumber: { type: String },
  relation: {
    type: String,
    enum: ["Father", "Mother", "Guardian", "Other"],
    default: "Other",
  },
  password: {
    type: String,
    required: true,
  },

  resetToken: { type: String },

  resetTokenExpiry: { type: Date },

  refreshToken: { type: String },

  userType: {
    type: String,
    default: "Guardian",
  },
});

export default mongoose.model("Guardian", guardianSchema);

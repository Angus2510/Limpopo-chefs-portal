import mongoose from "mongoose";

const legalDocumentSchema = new mongoose.Schema({
  title: String,
  description: String,
  documentUrl: String,
  uploadDate: { type: Date, default: Date.now },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
});

export default mongoose.model("LegalDocument", legalDocumentSchema);

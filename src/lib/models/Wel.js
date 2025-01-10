import mongoose from "mongoose";

const welSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  dateUploaded: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
  },
  accommodation: {
    type: Boolean,
  },
  available: {
    type: Boolean,
    default: true,
  },
  note: {
    type: String,
  },
  photoPath: [
    {
      type: String,
    },
  ],
});

export default mongoose.model("wel", welSchema);

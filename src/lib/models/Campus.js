import mongoose from "mongoose";

const campusSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Campus", campusSchema);

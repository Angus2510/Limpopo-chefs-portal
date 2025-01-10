import mongoose from "mongoose";
const accommodationSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
  },
  address: {
    type: String,
  },
  roomType: {
    type: String,
  },
  occupantType: {
    type: String,
  },
  numberOfOccupants: {
    type: Number,
  },
  costPerBed: {
    type: Number,
  },
  occupants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
  ],
});
export default mongoose.model("Accommodation", accommodationSchema);

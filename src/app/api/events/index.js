import dbConnect from "../../../utils/dbConnect";
import Event from "../../../models/Event";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ error: `Method '${req.method}' Not Allowed` });
  }

  try {
    console.log("Attempting to retrieve events...");
    const events = await Event.find()
      .populate("location")
      .populate("assignedTo")
      .populate("createdBy")
      .exec();

    if (!events || events.length === 0) {
      console.log("No events found.");
      return res.status(404).json({ message: "No events found" });
    }

    console.log("Events retrieved successfully.");
    res.status(200).json(events);
  } catch (error) {
    console.error("Error retrieving events:", error);
    res.status(500).json({ error: "Error retrieving events" });
  }
}

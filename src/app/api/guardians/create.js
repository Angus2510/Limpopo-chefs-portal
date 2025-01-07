import dbConnect from "../../../utils/dbConnect";
import Guardian from "../../../models/Guardian";
import nextConnect from "next-connect";

const handler = nextConnect();

handler.post(async (req, res) => {
  await dbConnect();

  const { firstName } = req.body;

  // Confirm data
  if (!firstName) {
    return res.status(400).json({ message: "First Name is required" });
  }

  const guardianObject = { firstName };

  try {
    // Create and store new guardian
    const guardian = await Guardian.create(guardianObject);

    if (guardian) {
      return res
        .status(201)
        .json({ message: "New guardian created", guardian });
    } else {
      return res
        .status(400)
        .json({ message: "Invalid guardian data received" });
    }
  } catch (error) {
    console.error("Error creating guardian:", error);
    return res.status(500).json({ message: "Error creating guardian" });
  }
});

export default handler;

import dbConnect from "../../../utils/dbConnect";
import Qualification from "../../../models/Qualification";
import nextConnect from "next-connect";

const handler = nextConnect();

handler.get(async (req, res) => {
  await dbConnect();

  try {
    const qualifications = await Qualification.find().lean();

    if (!qualifications?.length) {
      return res.status(400).json({ message: "No qualifications found" });
    }

    res.json(qualifications);
  } catch (error) {
    console.error("Error fetching qualifications:", error);
    res.status(500).json({ error: "Error fetching qualifications" });
  }
});

handler.post(async (req, res) => {
  await dbConnect();

  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    const qualification = new Qualification({ title, description });
    await qualification.save();

    res
      .status(201)
      .json({ message: "Qualification created successfully", qualification });
  } catch (error) {
    console.error("Error creating qualification:", error);
    res.status(500).json({ error: "Error creating qualification" });
  }
});

export default handler;

import dbConnect from "../../../utils/dbConnect";
import Wel from "../../../models/Wel";
import nextConnect from "next-connect";

const handler = nextConnect();

handler.get(async (req, res) => {
  await dbConnect();

  try {
    const wels = await Wel.find();
    res.status(200).json(wels);
  } catch (error) {
    console.error("Error fetching W.E.L records:", error);
    res.status(500).json({ message: "Error fetching W.E.L records" });
  }
});

export default handler;

import dbConnect from "../../../utils/dbConnect";
import Wel from "../../../models/Wel";
import nextConnect from "next-connect";

const handler = nextConnect();

handler.get(async (req, res) => {
  await dbConnect();

  try {
    const { id } = req.query;
    const wel = await Wel.findById(id);

    if (!wel) {
      return res.status(404).json({ message: "W.E.L record not found" });
    }

    res.status(200).json(wel);
  } catch (error) {
    console.error("Error fetching W.E.L record:", error);
    res.status(500).json({ message: "Error fetching W.E.L record" });
  }
});

export default handler;

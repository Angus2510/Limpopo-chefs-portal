import nextConnect from "next-connect";
import authMiddleware from "../../../middleware/authMiddleware";
import dbConnect from "../../../utils/dbConnect";

const handler = nextConnect();

handler.use(authMiddleware);

handler.get(async (req, res) => {
  await dbConnect();

  try {
    // Your protected route logic here
    res
      .status(200)
      .json({ message: "Protected route accessed", user: req.user });
  } catch (error) {
    console.error("Error accessing protected route:", error);
    res.status(500).json({ message: "Error accessing protected route" });
  }
});

export default handler;

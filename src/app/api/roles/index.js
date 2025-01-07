import dbConnect from "../../../utils/dbConnect";
import Roles from "../../../models/Roles";
import axios from "axios";
import nextConnect from "next-connect";

const WEBHOOK_URL = "https://limpopochefs.vercel.app/api/webhook";

const notifyWebhook = async (payload) => {
  try {
    const response = await axios.post(WEBHOOK_URL, payload);
    console.log("Webhook notification sent:", response.data);
  } catch (error) {
    console.error("Error sending webhook notification:", error.message);
  }
};

const handler = nextConnect();

handler.post(async (req, res) => {
  await dbConnect();

  try {
    const { roleName, description, permissions } = req.body;

    if (!roleName || !description || !permissions) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newRole = new Roles({
      roleName,
      description,
      permissions,
    });

    await newRole.save();

    // Notify webhook
    await notifyWebhook({ roleName, description, permissions });

    res.status(201).json({ message: "Role added successfully", newRole });
  } catch (error) {
    console.error("Error adding role:", error);
    res.status(500).json({ error: "Error adding role" });
  }
});

export default handler;

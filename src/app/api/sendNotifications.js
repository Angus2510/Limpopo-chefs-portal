// pages/api/sendNotification.js
import { emitNotification } from "../../lib/socket";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { userId, notification } = req.body;

    try {
      await emitNotification(userId, notification);
      res.status(200).json({ message: "Notification sent successfully!" });
    } catch (error) {
      res.status(500).json({ message: "Error sending notification" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}

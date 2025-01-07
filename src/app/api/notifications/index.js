import dbConnect from "../../../utils/dbConnect";
import Notification from "../../../models/Notification";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    return getNotifications(req, res);
  } else if (req.method === "POST") {
    return createNotification(req, res);
  } else {
    return res
      .status(405)
      .json({ error: `Method '${req.method}' Not Allowed` });
  }
}

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().lean();
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Error fetching notifications" });
  }
};

const createNotification = async (req, res) => {
  try {
    const { title, message, userId } = req.body;

    if (!title || !message || !userId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const notification = new Notification({
      title,
      message,
      user: userId,
    });

    await notification.save();
    res
      .status(201)
      .json({ message: "Notification created successfully", notification });
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ error: "Error creating notification" });
  }
};

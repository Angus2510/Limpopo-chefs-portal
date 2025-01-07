import { getModerationRecordsByResultId } from "../../../controllers/assignmentModerationController";

// Route handler to get moderation records
export default async function handler(req, res) {
  if (req.method === "GET") {
    await getModerationRecordsByResultId(req, res);
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

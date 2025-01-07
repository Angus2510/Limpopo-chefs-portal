import {
  getAllAssignments,
  createAssignment,
} from "../../controllers/assignmentController";

export async function GET(req, res) {
  try {
    const assignments = await getAllAssignments();
    res.status(200).json(assignments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function POST(req, res) {
  try {
    const newAssignment = await createAssignment(req.body);
    res.status(201).json(newAssignment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

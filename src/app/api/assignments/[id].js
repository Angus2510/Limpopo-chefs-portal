import {
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
} from "../../controllers/assignmentController";

export async function GET(req, res) {
  const { id } = req.query;

  try {
    const assignment = await getAssignmentById(id);
    res.status(200).json(assignment);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

export async function PUT(req, res) {
  const { id } = req.query;

  try {
    const updatedAssignment = await updateAssignment(id, req.body);
    res.status(200).json(updatedAssignment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function DELETE(req, res) {
  const { id } = req.query;

  try {
    const result = await deleteAssignment(id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

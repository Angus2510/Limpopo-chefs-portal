import { s3, bucketName } from "../../../config/s3";
import nextConnect from "next-connect";
import GeneralDocument from "../../../models/GeneralDocument";

const handler = nextConnect();

handler.delete(async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ error: "Invalid request format. id is required." });
    }

    const document = await GeneralDocument.findById(id);

    if (!document) {
      return res.status(404).json({ error: "Document not found." });
    }

    const key = document.documentUrl.split(".com/")[1];
    if (!key) {
      throw new Error(`Invalid documentUrl for document with ID ${id}`);
    }

    const deleteParams = {
      Bucket: bucketName,
      Delete: {
        Objects: [{ Key: key.trim() }],
        Quiet: false,
      },
    };

    const deleteResult = await s3.deleteObjects(deleteParams).promise();
    await GeneralDocument.findByIdAndDelete(id);

    res.json({
      message: "General document deleted successfully",
      deleteResult,
    });
  } catch (error) {
    console.error("Error deleting document:", error);
    res.status(500).json({ error: "Failed to delete general document" });
  }
});

export default handler;

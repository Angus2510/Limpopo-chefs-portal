import { s3, bucketName } from "../../../config/s3";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import nextConnect from "next-connect";
import path from "path";

const upload = multer({
  storage: multer.memoryStorage(),
});

const apiRoute = nextConnect({
  onError(error, req, res) {
    res
      .status(501)
      .json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.single("file"));

apiRoute.post(async (req, res) => {
  console.log("Received upload request");
  const file = req.file;
  const { assignmentId, questionId } = req.query;

  console.log("Request query params:", { assignmentId, questionId });
  console.log("Request file:", file);

  if (!file || !assignmentId || !questionId) {
    console.error("Missing required parameters or file");
    return res
      .status(400)
      .json({ error: "Missing required parameters or file" });
  }

  const fileExtension = path.extname(file.originalname);
  const fileName = `${uuidv4()}${fileExtension}`;
  const params = {
    Bucket: bucketName,
    Key: `assignments/${assignmentId}/questions/${questionId}/${fileName}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    const data = await s3.upload(params).promise();
    console.log("File uploaded successfully:", data);
    res.status(200).json({ message: "File uploaded successfully", data });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: "Error uploading file" });
  }
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false,
  },
};

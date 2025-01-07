import { s3, bucketName } from "../../../config/s3";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import nextConnect from "next-connect";
import LegalDocument from "../../../models/LegalDocument";
import path from "path";

const upload = multer({
  storage: multer.memoryStorage(),
});

const handler = nextConnect();

handler.use(upload.single("file"));

const sanitizeFileName = (fileName) => {
  return fileName.replace(/[\s!@#$%^&*()+={}[\]|\\:;'"<>?,/]/g, "_");
};

handler.post(async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file provided" });
    }

    const sanitizedFileName = sanitizeFileName(file.originalname);
    const fileName = `${uuidv4()}_${sanitizedFileName}`;

    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const data = await s3.upload(params).promise();

    // Save file metadata to database
    const legalDocument = new LegalDocument({
      title: req.body.title,
      description: req.body.description,
      documentUrl: data.Location,
      student: req.body.studentId,
    });
    await legalDocument.save();

    res.json({ url: data.Location });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to upload file to S3" });
  }
});

export default handler;

export const config = {
  api: {
    bodyParser: false,
  },
};

import formidable from "formidable";
import fs from "fs";
import { uploadFileToS3 } from "../../../utils/s3";

export const config = {
  api: {
    bodyParser: false, // Disable the default body parser for handling file uploads
  },
};

export default async function handler(req, res) {
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error parsing form data", error: err.message });
    }

    // Get the file from the `files` object
    const file = files.file[0]; // Assuming the field name for the file is 'file'

    // Upload the file to S3
    try {
      const s3Response = await uploadFileToS3(file, file.originalFilename);
      return res
        .status(200)
        .json({
          message: "File uploaded successfully",
          url: s3Response.Location,
        });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error uploading to S3", error: error.message });
    }
  });
}

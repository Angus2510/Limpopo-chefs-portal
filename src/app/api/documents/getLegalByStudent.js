import nextConnect from "next-connect";
import LegalDocument from "../../../models/LegalDocument";
import { getPreSignedUrl } from "../../../utils/s3Utils";

const handler = nextConnect();

handler.get(async (req, res) => {
  try {
    const legalDocuments = await LegalDocument.find({
      student: req.query.studentId,
    });

    const documentsWithSignedUrls = legalDocuments.map((doc) => {
      const fileKey = doc.documentUrl.split(".com/")[1];
      const signedUrl = getPreSignedUrl(fileKey);
      return {
        ...doc.toObject(),
        signedUrl,
      };
    });

    res.json(documentsWithSignedUrls);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to retrieve legal documents for the student" });
  }
});

export default handler;

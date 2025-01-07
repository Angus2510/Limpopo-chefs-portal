import nextConnect from "next-connect";
import GeneralDocument from "../../../models/GeneralDocument";
import { getPreSignedUrl } from "../../../utils/s3Utils";

const handler = nextConnect();

handler.get(async (req, res) => {
  try {
    const generalDocuments = await GeneralDocument.find();

    const documentsWithSignedUrls = generalDocuments.map((doc) => {
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
    res.status(500).json({ error: "Failed to retrieve general documents" });
  }
});

export default handler;

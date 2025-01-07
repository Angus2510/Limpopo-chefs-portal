import { s3, bucketName } from "../../../config/s3";
import nextConnect from "next-connect";
import GeneralDocument from "../../../models/GeneralDocument";

const handler = nextConnect();

handler.get(async (req, res) => {
  try {
    const generalDocument = await GeneralDocument.findById(req.query.id);
    if (!generalDocument) {
      return res.status(404).json({ error: "General document not found" });
    }

    const fileKey = generalDocument.documentUrl.split(".com/")[1];
    const fileName = fileKey.split("/").pop();

    const params = {
      Bucket: bucketName,
      Key: fileKey,
      Expires: 60,
      ResponseContentDisposition: `attachment; filename="${fileName}"`,
    };

    const url = s3.getSignedUrl("getObject", params);

    res.json({ url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate download URL" });
  }
});

export default handler;

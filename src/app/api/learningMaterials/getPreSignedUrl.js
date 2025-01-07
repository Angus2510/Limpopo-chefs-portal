import { s3, bucketName } from "../../../config/s3";

const getPreSignedUrl = (key) => {
  const params = {
    Bucket: bucketName,
    Key: key,
    Expires: 60 * 60, // 1 hour
  };

  return s3.getSignedUrl("getObject", params);
};

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ error: `Method '${req.method}' Not Allowed` });
  }

  const { key } = req.query;

  if (!key) {
    return res.status(400).json({ error: "Missing required parameter: key" });
  }

  try {
    const url = getPreSignedUrl(key);
    res.status(200).json({ url });
  } catch (error) {
    console.error("Error generating pre-signed URL:", error);
    res.status(500).json({ error: "Error generating pre-signed URL" });
  }
}

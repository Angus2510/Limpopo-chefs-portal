import { s3, bucketName } from "../../../config/s3";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ error: `Method '${req.method}' Not Allowed` });
  }

  const { key } = req.query;

  const params = {
    Bucket: bucketName,
    Key: key,
  };

  try {
    const data = await s3.getObject(params).promise();
    res.writeHead(200, {
      "Content-Type": data.ContentType,
      "Content-Length": data.ContentLength,
      "Content-Disposition": `attachment; filename="${key.split("/").pop()}"`,
    });
    res.write(data.Body);
    res.end();
  } catch (error) {
    console.error("Error downloading file:", error);
    res.status(500).json({ error: "Error downloading file" });
  }
}

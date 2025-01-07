import AWS from "aws-sdk";

// Initialize S3 client
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export const bucketName = process.env.S3_BUCKET_NAME;

export const uploadFileToS3 = async (file, filename) => {
  const params = {
    Bucket: bucketName,
    Key: `uploads/${Date.now()}-${filename}`,
    Body: file.buffer,
    ACL: "public-read", // Make file publicly accessible
    ContentType: file.mimetype,
  };

  try {
    const s3Response = await s3.upload(params).promise();
    return s3Response; // Return the response from S3 (e.g., file URL)
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw new Error("Error uploading to S3");
  }
};

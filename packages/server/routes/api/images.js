const express = require("express");
const router = express.Router();
const { s3Client } = require("../../utils/s3");
const { PutObjectCommand } = require("@aws-sdk/client-s3");

router.get("/test", async (request, response) => {
  const command = new PutObjectCommand({
    Bucket: "icebreak-assets",
    Key: "hello-s3.txt",
    Body: "Hello S3!",
  });

  try {
    const s3response = await s3Client.send(command);
    response.json({
      status: "success",
      data: {
        s3Response: s3response,
      },
    });
  } catch (err) {
    response.status(403).json({
      status: "error",
      message: err.message,
    });
  }
});

module.exports = router;

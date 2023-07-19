const express = require("express");
const fs = require("fs/promises");
const router = express.Router();
const { s3Client } = require("../../utils/s3");
const { PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const path = require("path");

router.get("/test-insert", async (request, response) => {
  const imageData = await fs.readFile(
    path.resolve(__dirname + "../../../../../assets/small_banner.jpg")
  );

  const command = new PutObjectCommand({
    Bucket: "icebreak-assets",
    Key: "small_banner.jpg",
    Body: imageData,
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

router.get("/test-get", async (request, response) => {
  const command = new GetObjectCommand({
    Bucket: "icebreak-assets",
    Key: "small_banner.jpg",
  });

  try {
    const s3Response = await s3Client.send(command);
    s3Response.Body.pipe(response);
  } catch (err) {
    response.status(403).json({
      status: "error",
      message: err.message,
    });
  }
});

module.exports = router;

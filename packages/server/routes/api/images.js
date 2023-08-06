const express = require("express");
const fs = require("fs/promises");
const router = express.Router();
const { s3Client } = require("../../utils/s3");
const { PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const path = require("path");

const AuthController = require("../../controllers/auth");
const ImagesController = require("../../controllers/images");

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

router.put("/:type", AuthController.authenticate, async (request, response) => {
  const imageType = request.params.type;
  const imageData = request.body.imageData;

  if (
    imageType !== "user_icon" &&
    imageType !== "guild_icon" &&
    imageType !== "guild_banner" &&
    imageType !== "event_banner"
  ) {
    response.status(400).json({
      status: "fail",
      message: "Image type '" + imageType + "' is invalid.",
    });
    return;
  }
  if (imageData === undefined) {
    response.status(400).json({
      status: "fail",
      message: "Request body missing values 'id' and/or 'imageData'.",
    });
    return;
  }

  try {
    const url = ImagesController.upload(imageType, imageData);
    response.status(200).json({
      status: "success",
      data: {
        imageURL: url,
      },
    });
  } catch (err) {
    response.status(500).json({
      status: "error",
      message: err.message,
    });
  }
});

router.get(
  "/:type/:id",
  AuthController.authenticate,
  async (request, response) => {
    const imageType = request.params.type;
    const id = request.params.id;

    if (
      imageType !== "user_icon" &&
      imageType !== "guild_icon" &&
      imageType !== "guild_banner" &&
      imageType !== "event_banner"
    ) {
      response.status(403).json({
        status: "fail",
        message: "Image type '" + imageType + "' is invalid.",
      });
      return;
    }

    try {
      const s3response = ImagesController.retrieve(imageType, id);
      response.status(200);
      s3response.Body.pipe(response);
    } catch (err) {
      response.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  }
);

module.exports = router;

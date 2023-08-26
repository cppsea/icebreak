const express = require("express");
const fs = require("fs/promises");
const router = express.Router();
const { s3Client } = require("../../utils/s3");
const { PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const AuthController = require("../../controllers/auth");
const ImagesController = require("../../controllers/images");

const validImageTypes = [
  "user_icon",
  "guild_icon",
  "guild_banner",
  "event_banner",
];

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

router.put(
  "/:type/:UUID",
  AuthController.authenticate,
  async (request, response) => {
    const imageType = request.params.type;
    const imageUUID = request.params.UUID;
    const imageData = request.body.imageData;

    if (!validImageTypes.includes(imageType)) {
      response.status(400).json({
        status: "fail",
        data: {
          imageType: `Image type '${imageType}' is invalid.`,
        },
      });
      return;
    }
    if (!uuidv4.validate(imageUUID)) {
      response.status(400).json({
        status: "fail",
        data: {
          imageUUID: `Image UUID '${imageUUID}' is invalid.`,
        },
      });
      return;
    }
    if (!imageData) {
      response.status(400).json({
        status: "fail",
        data: {
          imageData: "Request body missing value 'imageData'.",
        },
      });
      return;
    }

    try {
      const url = await ImagesController.upload(
        imageType,
        imageUUID,
        imageData
      );
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
  }
);

router.get(
  "/:type/:UUID",
  AuthController.authenticate,
  async (request, response) => {
    const imageType = request.params.type;
    const imageUUID = request.params.UUID;

    if (!validImageTypes.includes(imageType)) {
      response.status(403).json({
        status: "fail",
        data: {
          imageType: `Image type '${imageType}' is invalid.`,
        },
      });
      return;
    }
    if (!uuidv4.validate(imageUUID)) {
      response.status(400).json({
        status: "fail",
        data: {
          imageUUID: `Image UUID '${imageUUID}' is invalid.`,
        },
      });
      return;
    }

    try {
      const url = await ImagesController.retrieve(imageType, imageUUID);
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
  }
);

module.exports = router;

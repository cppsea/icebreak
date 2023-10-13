const express = require("express");
const router = express.Router();
const { validate } = require("uuid");

const AuthController = require("../../controllers/auth");
const ImagesController = require("../../controllers/images");

const VALID_IMAGE_TYPES = [
  "user_icon",
  "guild_icon",
  "guild_banner",
  "event_banner",
];

router.put(
  "/:type/:UUID",
  AuthController.authenticate,
  async (request, response) => {
    const imageType = request.params.type;
    const imageUUID = request.params.UUID;
    const imageData = request.body.imageData;

    if (!VALID_IMAGE_TYPES.includes(imageType)) {
      response.status(400).json({
        status: "fail",
        data: {
          imageType: `Image type '${imageType}' is invalid.`,
        },
      });
      return;
    }
    if (!validate(imageUUID)) {
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
    if (!(await ImagesController.exists(imageType, imageUUID))) {
      response.status(400).json({
        status: "fail",
        data: {
          imageUUID: `A ${imageType} with UUID ${imageUUID} does not exist.`,
        },
      });
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

    if (!VALID_IMAGE_TYPES.includes(imageType)) {
      response.status(400).json({
        status: "fail",
        data: {
          imageType: `Image type '${imageType}' is invalid.`,
        },
      });
      return;
    }
    if (!validate(imageUUID)) {
      response.status(400).json({
        status: "fail",
        data: {
          imageUUID: `Image UUID '${imageUUID}' is invalid.`,
        },
      });
      return;
    }

    try {
      const s3response = await ImagesController.retrieve(imageType, imageUUID);
      response.status(200);
      response.send(s3response);
    } catch (err) {
      response.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  }
);

router.delete(
  "/:type/:UUID",
  AuthController.authenticate,
  async (request, response) => {
    const imageType = request.params.type;
    const imageUUID = request.params.UUID;
    if (!VALID_IMAGE_TYPES.includes(imageType)) {
      response.status(400).json({
        status: "fail",
        data: {
          imageType: `Image type ${imageType} is invalid.`,
        },
      });
      return;
    }
    if (!validate(imageUUID)) {
      response.status(400).json({
        status: "fail",
        data: {
          imageUUID: `Image UUID '${imageUUID}' is invalid.`,
        },
      });
      return;
    }
    try {
      const deleteResponse = await ImagesController.remove(
        imageType,
        imageUUID
      );
      console.log(deleteResponse);
      response.status(200).json({
        status: "success",
        data: null,
      });
    } catch (err) {
      response.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  }
);

router.patch(
  "/:type/:UUID",
  AuthController.authenticate,
  async (request, response) => {
    const imageType = request.params.type;
    const imageUUID = request.params.UUID;
    const imageData = request.body.imageData;
    if (!imageData.startsWith("/9j/")) {
      response.status(400).json({
        status: "fail",
        message: `Invalid Base64-encoded JPEG`,
      });
      return;
    }
    if (!VALID_IMAGE_TYPES.includes(imageType)) {
      response.status(400).json({
        status: "fail",
        message: `Image type ${imageType} is invalid.`,
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
    if (!validate(imageUUID)) {
      response.status(400).json({
        status: "fail",
        data: {
          imageUUID: `Image UUID '${imageUUID}' is invalid.`,
        },
      });
      return;
    }
    try {
      const url = await ImagesController.update(
        imageType,
        imageData,
        imageUUID
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

module.exports = router;

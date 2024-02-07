const express = require("express");
const router = express.Router();
const { matchedData, validationResult } = require("express-validator");

const AuthController = require("../../controllers/auth");
const ImagesController = require("../../controllers/images");
const {
  jpegBase64Validator,
  entityValidator,
} = require("../../validators/images");

router.post(
  "/:imageType/:entityUUID",
  entityValidator,
  jpegBase64Validator,
  AuthController.authenticate,
  async (request, response) => {
    const result = validationResult(request);
    if (!result.isEmpty()) {
      return response.status(400).json({
        status: "fail",
        data: result.array(),
      });
    }

    const { imageType, entityUUID, jpegBase64 } = matchedData(request);

    try {
      const url = await ImagesController.uploadImageInAWS(
        imageType,
        entityUUID,
        jpegBase64
      );

      await ImagesController.updateImageInDb(imageType, entityUUID, url);

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
  "/:imageType/:entityUUID",
  AuthController.authenticate,
  entityValidator,
  async (request, response) => {
    const result = validationResult(request);
    if (!result.isEmpty()) {
      return response.status(400).json({
        status: "fail",
        data: result.array(),
      });
    }

    const { imageType, entityUUID } = matchedData(request);

    try {
      const url = await ImagesController.getImageInDb(imageType, entityUUID);
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

router.delete(
  "/:imageType/:entityUUID",
  AuthController.authenticate,
  entityValidator,
  async (request, response) => {
    const result = validationResult(request);
    if (!result.isEmpty()) {
      return response.status(400).json({
        status: "fail",
        data: result.array(),
      });
    }

    const { imageType, entityUUID } = matchedData(request);
    try {
      await ImagesController.deleteImageInAWS(imageType, entityUUID);
      // set image column for entity in db to null = deleting image
      await ImagesController.updateImageInDb(imageType, entityUUID, null);

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

router.put(
  "/:imageType/:entityUUID",
  AuthController.authenticate,
  entityValidator,
  jpegBase64Validator,
  async (request, response) => {
    const result = validationResult(request);
    if (!result.isEmpty()) {
      return response.status(400).json({
        status: "fail",
        data: result.array(),
      });
    }

    const { imageType, entityUUID, jpegBase64 } = matchedData(request);
    try {
      const url = await ImagesController.updateImageInAWS(
        imageType,
        entityUUID,
        jpegBase64
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

const express = require("express");
const router = express.Router();
const { validate } = require("uuid");

const AuthController = require("../../controllers/auth");
const ImagesController = require("../../controllers/images");

const validImageTypes = [
  "user_icon",
  "guild_icon",
  "guild_banner",
  "event_banner",
];

router.put(
  "/:type/:UUID",
  //AuthController.authenticate,
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

    try {
      const url = await ImagesController.upload(imageType, imageData);
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
  "/:type/:id",
  //AuthController.authenticate,
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
      const s3response = await ImagesController.retrieve(imageType, id);
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

router.delete(
  "/:type/:id",
  //AuthController.authenticate,
  async (request, response) => {
    const imageType = request.params.type;
    const id = request.params.id;
    if (!validImageTypes.includes(imageType)) {
      response.status(403).json({
        status: "fail",
        data: {
          imageType: `Image type ${imageType} is invalid.`,
        },
      });
      return;
    }
    // if (!validate(imageUUID)) {
    //   response.status(400).json({
    //     status: "fail",
    //     data: {
    //       imageUUID: `Image UUID '${imageUUID}' is invalid.`,
    //     },
    //   });
    //   return;
    // }
    try {
      const deleteResponse = await ImagesController.Delete(imageType, id);
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
  "/:type/:id",
  //AuthController.authenticate,
  async (request, response) => {
    const imageType = request.params.type;
    const id = request.params.id;
    const imageData = request.body.imageData;
    //  For testing
    // const imageData = await fs.readFile(
    //   path.resolve(__dirname + "../../../../../assets/test.jpg")
    // );
    if (!validImageTypes.includes(imageType)) {
      response.status(403).json({
        status: "fail",
        message: `Image type ${imageType} is invalid.`,
      });
      return;
    }
    if (!imageData) {
      response.status(400).json({
        status: "fail",
        message: "Request body missing values 'id' and/or 'imageData'.",
      });
      return;
    }
    // if (!validate(imageUUID)) {
    //   response.status(400).json({
    //     status: "fail",
    //     data: {
    //       imageUUID: `Image UUID '${imageUUID}' is invalid.`,
    //     },
    //   });
    //   return;
    // }
    try {
      const url = await ImagesController.patch(imageType, imageData, id);
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

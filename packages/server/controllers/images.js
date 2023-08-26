const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { s3Client } = require("../utils/s3");
const { PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");

const EXPIRATION_IN_SECONDS = 3600;

async function upload(imageType, imageUUID, imageData) {
  const key = imageType + "." + imageUUID + ".jpg";
  const body = Buffer.from(imageData, "base64");

  const putObjectCommand = new PutObjectCommand({
    Bucket: "icebreak-assets",
    Key: key,
    Body: body,
  });
  const getObjectCommand = new GetObjectCommand({
    Bucket: "icebreak-assets",
    Key: key,
  });

  await s3Client.send(putObjectCommand);
  return await getSignedUrl(s3Client, getObjectCommand, {
    expiresIn: EXPIRATION_IN_SECONDS,
  });
}

async function retrieve(imageType, imageUUID) {
  const key = imageType + "." + imageUUID + ".jpg";
  const command = new GetObjectCommand({
    Bucket: "icebreak-assets",
    Key: key,
  });

  return await getSignedUrl(s3Client, command, {
    expiresIn: EXPIRATION_IN_SECONDS,
  });
}

module.exports = {
  upload,
  retrieve,
};

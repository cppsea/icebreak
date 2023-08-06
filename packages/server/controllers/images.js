const { v4: uuidv4 } = require("uuid");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { s3Client } = require("../utils/s3");
const { PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");

async function upload(imageType, imageData) {
  const id = uuidv4();
  const key = imageType + "." + id + ".jpg";
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
    expiresIn: 3600,
  });
}

async function retrieve(imageType, id) {
  const key = imageType + "." + id + ".jpg";
  const command = new GetObjectCommand({
    Bucket: "icebreak-assets",
    Key: key,
  });

  return await s3Client.send(command);
}

module.exports = {
  upload,
  retrieve,
};

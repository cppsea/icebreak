const { v4: uuidv4 } = require("uuid");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { s3Client } = require("../utils/s3");
const { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");

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
  const key = id + ".jpg";
  //const key = imageType + "." + id + ".jpg"; UUID
  const command = new GetObjectCommand({
    Bucket: "icebreak-assets",
    Key: key,
  });

  return await s3Client.send(command);
}

async function Delete(imageType, id) {
  const key = id + ".jpg";
  //const key = imageType + "." + id + ".jpg"; UUID
  const command = new DeleteObjectCommand({
    Bucket: "icebreak-assets",
    Key: key,
  });

  try {
    const response = await s3Client.send(command);
    console.log(response, "success");
  } catch (err) {
    console.error(err, "error");
  }
}

async function patch(imageType, imageData, id) {
  const key = id + ".jpg";
  //const key = imageType + "." + id + ".jpg"; UUID
  const body = Buffer.from(imageData, "base64");
  const command = new PutObjectCommand({
    Bucket: "icebreak-assets",
    Key: key,
    Body: body,
  });

  try {
    const response = await s3Client.send(command);
    console.log(response);
  } catch (err) {
    console.error(err);
  }
}
module.exports = {
  upload,
  retrieve,
  Delete,
  patch,
};

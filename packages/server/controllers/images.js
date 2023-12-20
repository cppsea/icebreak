const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { s3Client } = require("../utils/s3");
const {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} = require("@aws-sdk/client-s3");
const prisma = require("../prisma/prisma");

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

async function remove(imageType, imageUUID) {
  const key = imageType + "." + imageUUID + ".jpg";
  const command = new DeleteObjectCommand({
    Bucket: "icebreak-assets",
    Key: key,
  });
  const response = await s3Client.send(command);
  return response;
}

async function update(imageType, imageData, imageUUID) {
  const key = imageType + "." + imageUUID + ".jpg";
  const body = Buffer.from(imageData, "base64");
  const patchObjectCommand = new PutObjectCommand({
    Bucket: "icebreak-assets",
    Key: key,
    Body: body,
  });
  const getObjectCommand = new GetObjectCommand({
    Bucket: "icebreak-assets",
    Key: key,
  });
  await s3Client.send(patchObjectCommand);
  return await getSignedUrl(s3Client, getObjectCommand, {
    expiresIn: EXPIRATION_IN_SECONDS,
  });
}

async function existsInS3(imageType, imageUUID) {
  const key = imageType + "." + imageUUID + ".jpg";
  const command = new HeadObjectCommand({
    Bucket: "icebreak-assets",
    Key: key,
  });
  await s3Client.send(command);
}

async function existsInPrisma(imageType, imageUUID) {
  switch (imageType) {
    case "user_icon":
      return !!(await prisma.users.findUnique({
        where: {
          userId: imageUUID,
        },
      }));
    case "guild_icon":
    case "guild_banner":
      return !!(await prisma.guilds.findUnique({
        where: {
          guildId: imageUUID,
        },
      }));
    case "event_banner":
      return !!(await prisma.events.findUnique({
        where: {
          eventId: imageUUID,
        },
      }));
  }
}

module.exports = {
  upload,
  retrieve,
  remove,
  update,
  existsInS3,
  existsInPrisma,
};

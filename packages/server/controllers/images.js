const prisma = require("../prisma/prisma");
const { s3Client } = require("../utils/s3");
const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");

const AWS_URL = "https://icebreak-assets.s3.us-west-1.amazonaws.com";

async function uploadImageInAWS(imageType, entityUUID, imageData) {
  const key = imageType + "." + entityUUID + ".jpg";
  const body = Buffer.from(imageData, "base64");

  const putObjectCommand = new PutObjectCommand({
    Bucket: "icebreak-assets",
    Key: key,
    Body: body,
  });

  await s3Client.send(putObjectCommand);
  const imageUrl = `${AWS_URL}/${key}`;
  return imageUrl;
}

async function getImageInDb(imageType, entityUUID) {
  switch (imageType) {
    case "user_avatar":
      return prisma.user.findUniqueOrThrow({
        where: {
          userId: entityUUID,
        },
        select: {
          avatar: true,
        },
      });
    case "guild_avatar":
      return prisma.guild.findUniqueOrThrow({
        where: {
          guildId: entityUUID,
        },
        select: {
          avatar: true,
        },
      });
    case "guild_banner":
      return prisma.guild.findUniqueOrThrow({
        where: {
          guildId: entityUUID,
        },
        select: {
          banner: true,
        },
      });
    case "event_thumbnail":
      return prisma.event.findUniqueOrThrow({
        where: {
          eventId: entityUUID,
        },
        select: {
          thumbnail: true,
        },
      });
  }
}

async function deleteImageInAWS(imageType, entityUUID) {
  const key = imageType + "." + entityUUID + ".jpg";
  const command = new DeleteObjectCommand({
    Bucket: "icebreak-assets",
    Key: key,
  });

  await s3Client.send(command);
}

async function updateImageInAWS(imageType, entityUUID, imageData) {
  const key = imageType + "." + entityUUID + ".jpg";
  const body = Buffer.from(imageData, "base64");
  const putObjectCommand = new PutObjectCommand({
    Bucket: "icebreak-assets",
    Key: key,
    Body: body,
  });

  await s3Client.send(putObjectCommand);
  const imageUrl = `${AWS_URL}/${key}`;
  return imageUrl;
}

async function updateImageInDb(imageType, entityUUID, imageUrl) {
  switch (imageType) {
    case "user_avatar":
      await prisma.user.update({
        where: {
          userId: entityUUID,
        },
        data: {
          avatar: imageUrl,
        },
      });
      break;
    case "guild_avatar":
      await prisma.guild.update({
        where: {
          guildId: entityUUID,
        },
        data: {
          avatar: imageUrl,
        },
      });
      break;
    case "guild_banner":
      await prisma.guild.update({
        where: {
          guildId: entityUUID,
        },
        data: {
          banner: imageUrl,
        },
      });
      break;
    case "event_thumbnail":
      await prisma.event.update({
        where: {
          eventId: entityUUID,
        },
        data: {
          thumbnail: imageUrl,
        },
      });
      break;
  }
}

module.exports = {
  uploadImageInAWS,
  getImageInDb,
  deleteImageInAWS,
  updateImageInAWS,
  updateImageInDb,
};

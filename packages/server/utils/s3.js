const { S3Client } = require("@aws-sdk/client-s3");
const s3Client = new S3Client({ region: "us-west-1" });

const s3ImagesUrlRegex =
  /^https:\/\/icebreak-assets\.s3\.us-west-1\.amazonaws\.com\/.*\.jpg$/;

module.exports = { s3Client, s3ImagesUrlRegex };

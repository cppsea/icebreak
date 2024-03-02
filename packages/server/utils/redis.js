const redis = require("ioredis");
const crypto = require("node:crypto");

// Create a Redis client instance
const redisClient = new redis(process.env.REDIS_URL);

// Function to check if a token is valid by verifying its absence in the Redis set
async function checkInvalidToken(token) {
  const isMember = await redisClient.sismember("token_blacklist", token);
  if (isMember === 1) {
    return true;
  } else {
    return false;
  }
}

async function addToTokenBlacklist(token) {
  await redisClient.sadd("token_blacklist", token);
}

// Function to check if a password reset token is valid by verifying its absence in the Redis set
async function checkInvalidPasswordResetToken(token) {
  // hash the token before checking the hashed tokens in the set
  const hash = crypto.createHash("sha256");
  hash.update(token);
  const hashedToken = hash.digest("hex");

  const isMember = await redisClient.sismember(
    "password_reset_token_blacklist",
    hashedToken
  );
  if (isMember === 1) {
    return true;
  } else {
    return false;
  }
}

async function addToPasswordResetTokenBlacklist(token) {
  // hash the token before tossing it into the set
  const hash = crypto.createHash("sha256");
  hash.update(token);
  const hashedToken = hash.digest("hex");
  await redisClient.sadd("password_reset_token_blacklist", hashedToken);
}

// Log any errors that occur during the Redis connection
redisClient.on("error", (error) => {
  console.error("Redis connection error:", error);
});

// Export the Redis client
module.exports = {
  redisClient,
  checkInvalidToken,
  addToTokenBlacklist,
  checkInvalidPasswordResetToken,
  addToPasswordResetTokenBlacklist,
};

const redis = require("ioredis");

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

// Log any errors that occur during the Redis connection
redisClient.on("error", (error) => {
  console.error("Redis connection error:", error);
});

// Export the Redis client
module.exports = {
  redisClient,
  checkInvalidToken,
  addToTokenBlacklist,
};

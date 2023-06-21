const redis = require("ioredis");

// Create a Redis client instance
const redisClient = new redis({
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD,
  port: process.env.REDIS_PORT,
});

// Function to check if a token is valid by verifying its absence in the Redis set
function isTokenValid(token, callback) {
  redisClient.sismember("token_blacklist", token, (error, result) => {
    if (error) {
      callback(error);
    } else {
      callback(null, result);
    }
  });
}

//Function to add a refresh token to the blacklist set
function addToBlacklist(token, callback) {
  redisClient.sadd("token_blacklist", token, (error, result) => {
    if (error) {
      callback(error);
    } else {
      callback(null, result === 1);
    }
  });
}

// Log any errors that occur during the Redis connection
redisClient.on("error", (error) => {
  console.error("Redis connection error:", error);
});

// Export the Redis client
module.exports = {
  redisClient,
  isTokenValid,
  addToBlacklist
};
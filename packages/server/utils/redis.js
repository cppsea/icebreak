const redis = require("redis");

// Create a Redis client instance
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});

// Log any errors that occur during the Redis connection
redisClient.on("error", (error) => {
  console.error("Redis connection error:", error);
});

// Export the Redis client
module.exports = redisClient;
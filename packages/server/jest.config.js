const config = {
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/__tests__/prisma_mock.js",
  ],
  setupFilesAfterEnv: ["<rootDir>/__tests__/prisma_mock.js"],
};

module.exports = config;

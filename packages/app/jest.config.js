/** @type {import('jest').Config} */
const config = {
  verbose: true,
  preset: "react-native", 
  setupFiles: ['./jest-setup.js'],
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!(jest-)?react-native|@react-native-community|@react-navigation)',
  ],
};

module.exports = config;
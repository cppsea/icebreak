import type {Config} from 'jest';
const config: Config = {
  verbose: true,
  preset: "react-native",
  setupFiles: ["./jest-setup.ts"],
  transformIgnorePatterns: [
    "<rootDir>/node_modules/(?!(jest-)?react-native|@react-native-community|@react-navigation)",
  ],
};

module.exports = config;

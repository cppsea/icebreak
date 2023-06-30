require("dotenv").config();

module.exports = {
  name: "Icebreak",
  slug: "icebreak",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  scheme: "icebreak",
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.sea.icebreak",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#FFFFFF",
    },
    package: "com.sea.icebreak",
  },
  web: {
    favicon: "./assets/favicon.png",
  },
  extra: {
    eas: {
      projectId: "f4f6f4b7-bba5-4158-b984-01140d189c07",
    },
    expoClientId: process.env.EXPO_CLIENT_ID,
    iosClientId: process.env.IOS_CLIENT_ID,
    anroidClientId: process.env.ANDROID_CLIENT_ID,
    webClientId: process.env.WEB_CLIENT_ID,
  },
};
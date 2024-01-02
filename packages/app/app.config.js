require("dotenv").config();

module.exports = {
  name: "Icebreak",
  slug: "icebreak",
  owner: "icebreak",
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
    infoPlist: {
      CFBundleURLTypes: [
        {
          CFBundleURLSchemes: [process.env.IOS_GOOGLE_URL_SCHEME],
        },
      ],
    },
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
      projectId: "9753a4fe-f34e-4269-95b5-f6d0399ed1c8",
    },
    expoClientId: process.env.EXPO_CLIENT_ID,
    iosClientId: process.env.IOS_CLIENT_ID,
    anroidClientId: process.env.ANDROID_CLIENT_ID,
    webClientId: process.env.WEB_CLIENT_ID,
  },
  plugins: [
    [
      "@react-native-google-signin/google-signin",
      {
        iosUrlScheme: process.env.IOS_GOOGLE_URL_SCHEME,
      },
    ],
  ],
};

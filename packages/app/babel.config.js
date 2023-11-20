module.exports = function (api) {
  api.cache(false);
  return {
    presets: [
      ["@babel/preset-env", { targets: { node: "current" } }],
      "babel-preset-expo",
      "@babel/preset-typescript",
    ],
    plugins: [
      [
        require.resolve("babel-plugin-module-resolver"),
        {
          include: ["."],
          root: ["."],
          alias: {
            "@app": ".",
          },
        },
      ],
      "react-native-reanimated/plugin",
      ["@babel/plugin-transform-private-methods", { loose: true }], // for jest
    ],
  };
};

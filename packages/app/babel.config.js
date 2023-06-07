module.exports = function(api) {
  api.cache(false);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        require.resolve('babel-plugin-module-resolver'),
        {
          include: ["."],
          root: ['.'],
          alias: {
            '@app': '.',
          },
        },
      ],
      [
        "module:react-native-dotenv", 
        {
          "moduleName": "@env",
          "path": "../server/.env",
          "blacklist": null,
          "whitelist": null,
          "safe": false,
          "allowUndefined": true
        }
      ]
    ],
  };
};

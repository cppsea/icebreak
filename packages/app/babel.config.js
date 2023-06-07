module.exports = function(api) {
  api.cache(false);
  return {
    "presets": ['babel-preset-expo'],
    "plugins": [
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
      'react-native-reanimated/plugin',
      [
        "module:react-native-dotenv", 
        {
          "moduleName": "@env",
          "path": ".env",
          "blacklist": null,
          "whitelist": null,
          "safe": false,
          "allowUndefined": true
        }
      ]
    ],
  };
};

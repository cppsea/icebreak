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
      ["@babel/plugin-proposal-private-methods", { "loose": true }],
    ],
  };
};

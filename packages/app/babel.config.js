module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      require.resolve('babel-plugin-module-resolver'),
      {
        root: ['./packages/app'],
        alias: {
          '@app': './packages/app',
        },
      },
    ],
  ],
};

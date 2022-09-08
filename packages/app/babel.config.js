module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      require.resolve('babel-plugin-module-resolver'),
      {
        root: ['./packages/app'],
        extensions: ['.ts', '.tsx', '.jsx', '.js', '.json', '.jpg', '.jpeg'],
        alias: {
          '@app': './packages/app',
        },
      },
    ],
  ],
};

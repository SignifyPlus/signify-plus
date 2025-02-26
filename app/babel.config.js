module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo", "@babel/preset-typescript"],
    plugins: ["react-native-reanimated/plugin",
      [
        'module-resolver',
        {
          root: ['./'], // Root of the project
          alias: {
            '@': './app', // Ensure this points to the correct `app/` directory
          },
        },
      ],
    ],
  };
};

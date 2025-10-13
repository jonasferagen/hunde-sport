// babel.config.js
module.exports = function (api) {
  api.cache(true);
  const easChannel = process.env.EAS_BUILD_CHANNEL; // e.g. "production"
  const keepLogs = process.env.KEEP_LOGS === "1";
  // Strip consoles in any build published on the "production" channel:
  const stripConsoles = easChannel === "production" && !keepLogs;

  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "@tamagui/babel-plugin",
        {
          components: ["tamagui"],
          config: "./src/tamagui/tamagui.config.ts",
          logTimings: false,
        },
      ],
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@": "./src",
            "react-native-device-info": "./react-native-device-info.js",
          },
          extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
        },
      ],
      stripConsoles && [
        "transform-remove-console",
        { exclude: ["error", "warn"] },
      ],

      "react-native-reanimated/plugin",
    ].filter(Boolean),
  };
};

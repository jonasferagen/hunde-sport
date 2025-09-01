module.exports = function (api) {
  api.cache(true);
  const profile = process.env.EAS_BUILD_PROFILE; // 'production', 'preview', etc.
  const keepLogs = process.env.KEEP_LOGS === "1";
  const stripConsoles = profile === "production" && !keepLogs;
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "@tamagui/babel-plugin",
        {
          components: ["tamagui"],
          config: "./tamagui/tamagui.config.ts",
          logTimings: true,
        },
      ],
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@": "./",
            "@domain": "./domain",
            "@cart": "./domain/cart",
            "@product": "./domain/product",
          },
          extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
        },
      ],
      stripConsoles && [
        "transform-remove-console",
        { exclude: ["error", "warn"] },
      ],
      "react-native-reanimated/plugin", // keep last
    ].filter(Boolean),
  };
};

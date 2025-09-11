// eslint.config.js (flat)
const { defineConfig } = require("eslint/config");
const expo = require("eslint-config-expo/flat");
const simpleImportSort = require("eslint-plugin-simple-import-sort");
const prettierFlat = require("eslint-config-prettier");

module.exports = defineConfig([
  // Expo flat preset(s)
  ...expo,

  {
    ignores: [
      "node_modules/**",
      "android/**",
      "ios/**",
      ".expo/**",
      "dist/**",
      "build/**",
      "coverage/**",
    ],
    files: ["**/*.{ts,tsx,js,jsx}"],

    plugins: {
      "simple-import-sort": simpleImportSort,
    },

    settings: {
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
        node: {
          extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
        },
      },
    },

    rules: {
      // import plugin
      "import/no-unresolved": "error",
      "import/no-duplicates": "warn",
      "import/no-cycle": ["warn", { maxDepth: 1 }],
      "import/no-unused-modules": [
        "warn",
        { unusedExports: true, missingExports: true },
      ],
      // sorting (source of truth)
      "simple-import-sort/imports": "warn",
      "simple-import-sort/exports": "warn",
    },
  },

  // Put Prettier last to disable conflicting stylistic rules
  prettierFlat,
]);

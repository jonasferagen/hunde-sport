// eslint.config.js (flat)
const { defineConfig } = require("eslint/config");
const expo = require("eslint-config-expo/flat");
const simpleImportSort = require("eslint-plugin-simple-import-sort");
const prettierFlat = require("eslint-config-prettier");
//const importPlugin = require("eslint-plugin-import");
const unusedImports = require("eslint-plugin-unused-imports");
const reactPerf = require("eslint-plugin-react-perf");
const rn = require("eslint-plugin-react-native");

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
      "unused-imports": unusedImports,
      "react-perf": reactPerf,
      "react-native": rn,
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
      "unused-imports/no-unused-imports": "error",
      // sorting (source of truth)
      "simple-import-sort/imports": "warn",
      "simple-import-sort/exports": "warn",
      "react-perf/jsx-no-new-object-as-prop": "warn",
      "react-perf/jsx-no-new-array-as-prop": "warn",
      "react-perf/jsx-no-new-function-as-prop": "warn",
      "react/jsx-no-bind": ["warn", { allowArrowFunctions: false }],
      "react/jsx-no-constructed-context-values": "warn",
      "react/no-unstable-nested-components": "warn",
      "react-native/no-inline-styles": "warn",
    },
  },

  // Put Prettier last to disable conflicting stylistic rules
  prettierFlat,
]);

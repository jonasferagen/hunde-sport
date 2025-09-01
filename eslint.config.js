const { defineConfig } = require("eslint/config");
const expo = require("eslint-config-expo/flat");

// extra plugins you add
const simpleImportSort = require("eslint-plugin-simple-import-sort");

// flat Prettier config – keep last
const prettierFlat = require("eslint-config-prettier");

module.exports = defineConfig([
  // Expo preset(s)
  ...expo,

  // Your project rules on top
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
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],

    // Expo already sets the TS parser; keeping this minimal avoids extra work
    plugins: {
      "simple-import-sort": simpleImportSort,
    },

    settings: {
      // Make import/no-unresolved understand tsconfig paths like "@/..."
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
          alwaysTryTypes: true,
        },
        node: { extensions: [".js", ".jsx", ".ts", ".tsx"] }, // helps JS files too
      },
    },

    rules: {
      // ✅ Safety (provided by eslint-plugin-import that Expo already enables)
      "import/no-unresolved": "error",
      "import/no-duplicates": "warn",
      "import/no-cycle": ["warn", { maxDepth: 1 }],
      //"import/no-relative-parent-imports": "warn", // <- optional guard
      "simple-import-sort/imports": "warn",
      "simple-import-sort/exports": "warn",
      // TS handles extensions/resolution
      //"import/extensions": "off",
    },
  },

  // Put Prettier last to disable conflicting stylistic rules
  prettierFlat,
]);

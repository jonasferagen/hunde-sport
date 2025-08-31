// jest.config.js
module.exports = {
  preset: "jest-expo",
  testEnvironment: "jsdom", // ← was "node"
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testMatch: [
    "<rootDir>/**/__tests__/**/*.test.(ts|tsx|js)",
    "<rootDir>/tests/**/*.test.(ts|tsx|js)",
  ],
};

// jest.config.js
module.exports = {
  preset: "jest-expo",
  testPathIgnorePatterns: ["/node_modules/", "/tests/quarantine/"],
  transformIgnorePatterns: ["/node_modules/"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "^tests/(.*)$": "<rootDir>/tests/$1",
  },
  testMatch: [
    "<rootDir>/**/__tests__/**/*.(test|spec).(ts|tsx|js)",
    "<rootDir>/tests/**/*.(test|spec).(ts|tsx|js)",
  ],
};

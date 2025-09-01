module.exports = {
  preset: "jest-expo",
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "^@domain/(.*)$": "<rootDir>/domain/$1",
    "^@cart/(.*)$": "<rootDir>/domain/cart/$1",
    "^@product/(.*)$": "<rootDir>/domain/product/$1",
  },
  testMatch: [
    "<rootDir>/**/__tests__/**/*.(test|spec).(ts|tsx|js)",
    "<rootDir>/tests/**/*.(test|spec).(ts|tsx|js)",
  ],
};

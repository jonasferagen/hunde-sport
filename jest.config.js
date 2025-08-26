// jest.config.js
module.exports = {
    preset: 'jest-expo',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1', // so your "@/..." imports still work
    },
    testMatch: [
        '<rootDir>/**/__tests__/**/*.test.(ts|tsx|js)',
        '<rootDir>/tests/**/*.test.(ts|tsx|js)',
    ],
};

// Learn more: https://github.com/vercel/next.js/tree/canary/examples/with-jest
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  // Setup files to run before each test file in the suite is executed
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],

  // Configuration for module mappping and aliases
  moduleNameMapper: {
    "^@/src/app/(.*)$": "<rootDir>/src/app/$1",
  },

  // Configure testing environment
  testEnvironment: "jest-environment-jsdom",

  // Specify files to collect coverage from
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!**/node_modules/**"],

  // May slow down tests but collects coverage information when executing tests
  collectCoverage: true,

  // Include any files to ignore during coverage collection
  coveragePathIgnorePatterns: [
    "<rootDir>/src/app/components/",
    "<rootDir>/src/config.ts",
    "<rootDir>/src/app/types",
    "schema\\.ts",
    "\\.tsx",
  ],

  // Searches for matching test files
  testMatch: ["**/?(*.)+(test).[jt]s?(x)"],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);

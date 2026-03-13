module.exports = {
  preset: 'jest-expo',
  // Android-first project — use android platform for haste resolution
  haste: { defaultPlatform: 'android', platforms: ['android', 'ios', 'native'] },
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/**/*.test.{ts,tsx}'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|zustand)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@react-native-async-storage/async-storage$':
      '<rootDir>/node_modules/@react-native-async-storage/async-storage/jest/async-storage-mock',
    // Stub Expo's new-arch winter runtime that can't load in Node Jest
    '^expo/src/winter$': '<rootDir>/tests/__mocks__/expo-winter.js',
    '^expo/src/winter/(.*)$': '<rootDir>/tests/__mocks__/expo-winter.js',
    '^expo/virtual/(.*)$': '<rootDir>/tests/__mocks__/expo-winter.js',
  },
};

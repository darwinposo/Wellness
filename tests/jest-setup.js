// Mock expo winter runtime before jest-expo tries to load it
jest.mock('expo/src/winter', () => ({}));
jest.mock('expo/src/winter/FormData', () => ({
  installFormDataPatch: jest.fn(),
}));
jest.mock('expo/virtual/streams', () => ({}));

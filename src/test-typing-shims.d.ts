// Minimal test runtime shims for the TypeScript checker
declare const describe: any;
declare const it: any;
declare const test: any;
declare const beforeEach: any;
declare const afterEach: any;
declare const beforeAll: any;
declare const afterAll: any;
declare const expect: any;

declare const jest: any;

declare namespace jest {
  type Mock = any;
  type MockedFunction<T = any> = T & { mock?: any };
}

// allow importing common test libs without types in TS files
declare module "@testing-library/react-native";
declare module "@testing-library/jest-native/extend-expect";
declare module "jest-mock";

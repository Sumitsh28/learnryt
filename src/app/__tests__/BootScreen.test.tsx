declare const beforeEach: any;
declare const describe: any;
declare const expect: any;
declare const it: any;
declare const jest: any;

const { render, waitFor } = require("@testing-library/react-native");

import * as LocalAuthentication from "expo-local-authentication";
import JailMonkey from "jail-monkey";
import React from "react";

import { useAuth } from "../../store/useAuth";
import BootScreen from "../index";

jest.mock("expo-router", () => {
  const React = require("react");
  const { Text } = require("react-native");

  return {
    router: {
      back: jest.fn(),
      push: jest.fn(),
      replace: jest.fn(),
    },

    Redirect: ({ href }: { href: string }) =>
      React.createElement(Text, null, `Redirect Mock to ${href}`),

    useLocalSearchParams: () => ({
      id: "mock-id",
    }),
  };
});

jest.mock("nativewind", () => ({
  useColorScheme: () => ({
    colorScheme: "light",
  }),
}));

jest.mock("jail-monkey", () => ({
  isJailBroken: jest.fn(),
  canMockLocation: jest.fn(),
  hookDetected: jest.fn(),
}));

jest.mock("expo-local-authentication", () => ({
  hasHardwareAsync: jest.fn(),
  isEnrolledAsync: jest.fn(),
  authenticateAsync: jest.fn(),
}));

jest.mock("../../store/useAuth", () => ({
  useAuth: jest.fn(),
}));

type MockFunction = {
  mockReturnValue: (value: unknown) => MockFunction;
  mockResolvedValue: (value: unknown) => MockFunction;
};

const mockUseAuth = useAuth as unknown as MockFunction;

const mockIsJailBroken = JailMonkey.isJailBroken as unknown as MockFunction;

const mockCanMockLocation =
  JailMonkey.canMockLocation as unknown as MockFunction;

const mockHookDetected = JailMonkey.hookDetected as unknown as MockFunction;

const mockHasHardwareAsync =
  LocalAuthentication.hasHardwareAsync as unknown as MockFunction;

const mockIsEnrolledAsync =
  LocalAuthentication.isEnrolledAsync as unknown as MockFunction;

const mockAuthenticateAsync =
  LocalAuthentication.authenticateAsync as unknown as MockFunction;

describe("BootScreen Integration Suite", () => {
  const mockHydrate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseAuth.mockReturnValue({
      hydrate: mockHydrate,
      isLoading: false,
      isAuthenticated: false,
    });

    mockIsJailBroken.mockReturnValue(false);
    mockCanMockLocation.mockReturnValue(false);
    mockHookDetected.mockReturnValue(false);

    mockHasHardwareAsync.mockResolvedValue(false);
    mockIsEnrolledAsync.mockResolvedValue(false);

    mockAuthenticateAsync.mockResolvedValue({
      success: true,
    });
  });

  it("🔴 Should block users immediately if Jailbreak or device hook is verified", async () => {
    mockIsJailBroken.mockReturnValue(true);

    const utils = render(<BootScreen />);

    await waitFor(() => {
      expect(utils.getByText("Security Violation")).toBeTruthy();

      expect(
        utils.getByText(/jailbroken, rooted, or running debugging tools/i),
      ).toBeTruthy();
    });

    expect(LocalAuthentication.hasHardwareAsync).not.toHaveBeenCalled();
  });

  it("🟡 Should display App Locked view if hardware biometrics authentication fails", async () => {
    mockHasHardwareAsync.mockResolvedValue(true);

    mockIsEnrolledAsync.mockResolvedValue(true);

    mockAuthenticateAsync.mockResolvedValue({
      success: false,
      error: "authentication_failed",
    } as never);

    const utils = render(<BootScreen />);

    await waitFor(() => {
      expect(utils.getByText("App Locked")).toBeTruthy();

      expect(utils.getByText("Unlock App")).toBeTruthy();
    });
  });

  it("🟢 Should bypass biometric authentication smoothly if security hardware is absent", async () => {
    mockHasHardwareAsync.mockResolvedValue(false);

    render(<BootScreen />);

    await waitFor(() => {
      expect(mockHydrate).toHaveBeenCalled();
    });
  });

  it("🚀 Should redirect users seamlessly to active layouts if session is authentic", async () => {
    mockUseAuth.mockReturnValue({
      hydrate: mockHydrate,
      isLoading: false,
      isAuthenticated: true,
    });

    mockHasHardwareAsync.mockResolvedValue(false);

    const utils = render(<BootScreen />);

    await waitFor(() => {
      expect(utils.getByText("Redirect Mock to /(app)/(tabs)")).toBeTruthy();
    });
  });
});

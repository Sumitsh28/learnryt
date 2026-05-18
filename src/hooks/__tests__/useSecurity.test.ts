import { renderHook } from "@testing-library/react-native";

import * as LocalAuthentication from "expo-local-authentication";

import { useSecurity } from "../useSecurity";

jest.mock("expo-local-authentication", () => ({
  hasHardwareAsync: jest.fn(),
  isEnrolledAsync: jest.fn(),
  authenticateAsync: jest.fn(),
}));

describe("useSecurity", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should bypass auth if hardware missing", async () => {
    (LocalAuthentication.hasHardwareAsync as any).mockResolvedValue(false);

    const { result } = renderHook(() => useSecurity());

    const response = await result.current.requireBiometrics();

    expect(response).toBe(true);
  });

  it("should bypass auth if no biometrics enrolled", async () => {
    (LocalAuthentication.hasHardwareAsync as any).mockResolvedValue(true);

    (LocalAuthentication.isEnrolledAsync as any).mockResolvedValue(false);

    const { result } = renderHook(() => useSecurity());

    const response = await result.current.requireBiometrics();

    expect(response).toBe(true);
  });

  it("should authenticate successfully", async () => {
    (LocalAuthentication.hasHardwareAsync as any).mockResolvedValue(true);

    (LocalAuthentication.isEnrolledAsync as any).mockResolvedValue(true);

    (LocalAuthentication.authenticateAsync as any).mockResolvedValue({
      success: true,
    });

    const { result } = renderHook(() => useSecurity());

    const response = await result.current.requireBiometrics();

    expect(response).toBe(true);
  });

  it("should fail authentication", async () => {
    (LocalAuthentication.hasHardwareAsync as any).mockResolvedValue(true);

    (LocalAuthentication.isEnrolledAsync as any).mockResolvedValue(true);

    (LocalAuthentication.authenticateAsync as any).mockResolvedValue({
      success: false,
    });

    const { result } = renderHook(() => useSecurity());

    const response = await result.current.requireBiometrics();

    expect(response).toBe(false);
  });
});

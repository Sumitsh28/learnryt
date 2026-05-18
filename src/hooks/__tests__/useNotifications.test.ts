import { act, renderHook } from "@testing-library/react-native";
import { Alert, AppState, Platform } from "react-native";

import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

import { useNotifications } from "../useNotifications";

jest.mock("expo-device", () => ({
  isDevice: true,
}));

jest.mock("expo-notifications", () => ({
  setNotificationHandler: jest.fn(),
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
  cancelScheduledNotificationAsync: jest.fn(),
}));

describe("useNotifications", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    Platform.OS = "ios";

    Object.defineProperty(AppState, "currentState", {
      value: "active",
      configurable: true,
    });

    (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
      status: "denied",
    });
  });

  it("returns false on web", async () => {
    Platform.OS = "web";

    const { result } = renderHook(() => useNotifications());

    const response = await result.current.requestPermissions();

    expect(response).toBe(false);
  });

  it("returns false on simulator", async () => {
    Object.defineProperty(Device, "isDevice", {
      value: false,
      configurable: true,
    });

    (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({
      status: "denied",
    });

    const { result } = renderHook(() => useNotifications());

    const response = await result.current.requestPermissions();

    expect(response).toBe(false);

    Object.defineProperty(Device, "isDevice", {
      value: true,
      configurable: true,
    });
  });

  it("returns true when already granted", async () => {
    (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
      status: "granted",
    });

    const { result } = renderHook(() => useNotifications());

    const response = await result.current.requestPermissions();

    expect(response).toBe(true);
  });

  it("requests permissions when undetermined", async () => {
    (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
      status: "undetermined",
    });

    (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({
      status: "granted",
    });

    jest
      .spyOn(Alert, "alert")
      .mockImplementation((_title: string, _msg: string, buttons: any) => {
        buttons[1].onPress();
      });

    const { result } = renderHook(() => useNotifications());

    const response = await result.current.requestPermissions();

    expect(response).toBe(true);
  });

  it("schedules notification when app goes background", async () => {
    let appStateHandler: any;

    Object.defineProperty(AppState, "currentState", {
      value: "active",
      configurable: true,
    });

    jest
      .spyOn(AppState, "addEventListener")
      .mockImplementation((_event: string, handler: any) => {
        appStateHandler = handler;

        return {
          remove: jest.fn(),
        } as any;
      });

    renderHook(() => useNotifications());

    await act(async () => {
      await appStateHandler("background");
    });

    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalled();
  });

  it("cancels notification when app becomes active", async () => {
    let appStateHandler: any;

    Object.defineProperty(AppState, "currentState", {
      value: "background",
      configurable: true,
    });

    jest
      .spyOn(AppState, "addEventListener")
      .mockImplementation((_event: string, handler: any) => {
        appStateHandler = handler;

        return {
          remove: jest.fn(),
        } as any;
      });

    renderHook(() => useNotifications());

    await act(async () => {
      await appStateHandler("active");
    });

    expect(Notifications.cancelScheduledNotificationAsync).toHaveBeenCalledWith(
      "inactivity-reminder",
    );
  });
});

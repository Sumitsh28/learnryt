import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import React from "react";
import { Alert } from "react-native";

import ProfileScreen from "../profile";

import * as ImagePicker from "expo-image-picker";

import { router } from "expo-router";

import { useAuth } from "../../../../store/useAuth";
import { useBookmarks } from "../../../../store/useBookmarks";

import { apiClient } from "../../../../api/client";

jest.mock("../../../../api/client", () => ({
  apiClient: {
    patch: jest.fn(),
  },
}));

jest.mock("@/store/useAuth", () => ({
  useAuth: jest.fn(),
}));

jest.mock("../../../../store/useBookmarks", () => ({
  useBookmarks: jest.fn(),
}));

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
}));

jest.mock("expo-image-picker", () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn(),
  MediaTypeOptions: {
    Images: "Images",
  },
}));

jest.mock("nativewind", () => ({
  useColorScheme: () => ({
    colorScheme: "light",
    toggleColorScheme: jest.fn(),
  }),
}));

jest.mock("lucide-react-native", () => {
  return new Proxy(
    {},
    {
      get: () => "Icon",
    },
  );
});

describe("ProfileScreen", () => {
  const mockLogout = jest.fn();
  const mockUpdateUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useAuth as unknown as jest.Mock).mockReturnValue({
      user: {
        _id: "1",
        username: "sumit",
        email: "sumit@gmail.com",
        role: "USER",
      },
      logout: mockLogout,
      updateUser: mockUpdateUser,
    });

    (useBookmarks as unknown as jest.Mock).mockReturnValue({
      getUserBookmarks: jest.fn(() => ["1", "2"]),
    });
  });

  it("renders user info", () => {
    render(<ProfileScreen />);

    expect(screen.getByText("sumit")).toBeTruthy();
    expect(screen.getByText("sumit@gmail.com")).toBeTruthy();
    expect(screen.getByText("USER")).toBeTruthy();
  });

  it("opens notifications modal", () => {
    render(<ProfileScreen />);

    fireEvent.press(screen.getByText("Notifications"));

    expect(router.push).toHaveBeenCalledWith("/modals/notifications");
  });

  it("shows logout alert", () => {
    const alertSpy = jest.spyOn(Alert, "alert");

    render(<ProfileScreen />);

    fireEvent.press(screen.getByText("Sign Out"));

    expect(alertSpy).toHaveBeenCalled();
  });

  it("calls logout on confirm", () => {
    jest
      .spyOn(Alert, "alert")
      .mockImplementation((_t: string, _m: string, buttons: any) => {
        buttons[1].onPress();
      });

    render(<ProfileScreen />);

    fireEvent.press(screen.getByText("Sign Out"));

    expect(mockLogout).toHaveBeenCalled();
  });

  it("shows alert when permission denied", async () => {
    jest.spyOn(Alert, "alert").mockImplementation(jest.fn());

    (
      ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock
    ).mockResolvedValue({
      status: "denied",
    });

    render(<ProfileScreen />);

    fireEvent.press(screen.getByText("s"));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalled();
    });
  });

  it("uploads avatar successfully", async () => {
    (
      ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock
    ).mockResolvedValue({
      status: "granted",
    });

    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({
      canceled: false,
      assets: [
        {
          uri: "file://avatar.jpg",
        },
      ],
    });

    (apiClient.patch as jest.Mock).mockResolvedValue({
      data: {
        data: {
          username: "updated",
        },
      },
    });

    render(<ProfileScreen />);

    fireEvent.press(screen.getByText("s"));

    await waitFor(() => {
      expect(apiClient.patch).toHaveBeenCalled();
      expect(mockUpdateUser).toHaveBeenCalled();
    });
  });

  it("handles upload failure", async () => {
    jest.spyOn(Alert, "alert").mockImplementation(jest.fn());

    (
      ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock
    ).mockResolvedValue({
      status: "granted",
    });

    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({
      canceled: false,
      assets: [
        {
          uri: "file://avatar.jpg",
        },
      ],
    });

    (apiClient.patch as jest.Mock).mockRejectedValue({
      response: {
        data: {
          message: "failed",
        },
      },
    });

    render(<ProfileScreen />);

    fireEvent.press(screen.getByText("s"));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Upload Failed",
        "Could not update your avatar. Please try again.",
      );
    });
  });
});

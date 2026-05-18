import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import React from "react";

import CourseViewerScreen from "../[id]";

import * as SecureStore from "expo-secure-store";

import { router } from "expo-router";

jest.mock("expo-keep-awake", () => ({
  useKeepAwake: jest.fn(),
}));

jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(),
}));

jest.mock("nativewind", () => ({
  useColorScheme: () => ({
    colorScheme: "light",
  }),
}));

jest.mock("expo-router", () => ({
  router: {
    back: jest.fn(),
  },
  Stack: {
    Screen: () => null,
  },
  useLocalSearchParams: () => ({
    id: "1",
  }),
}));

jest.mock("react-native-webview", () => {
  const React = require("react");
  const { View, Pressable } = require("react-native");

  return {
    WebView: ({ onLoadEnd, onError }: any) => (
      <View>
        <Pressable testID="load-end" onPress={onLoadEnd} />
        <Pressable testID="error-webview" onPress={onError} />
      </View>
    ),
  };
});

jest.mock("lucide-react-native", () => {
  return new Proxy(
    {},
    {
      get: () => "Icon",
    },
  );
});

describe("CourseViewerScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue("token");
  });

  it("renders loading state", async () => {
    render(<CourseViewerScreen />);

    await waitFor(() => {
      expect(SecureStore.getItemAsync).toHaveBeenCalled();
    });

    expect(screen.getByText("Loading secure player...")).toBeTruthy();
  });

  it("loads webview successfully", async () => {
    render(<CourseViewerScreen />);

    await waitFor(() => {
      expect(SecureStore.getItemAsync).toHaveBeenCalled();
    });

    fireEvent.press(screen.getByTestId("load-end"));

    await waitFor(() => {
      expect(screen.queryByText("Loading secure player...")).toBeNull();
    });
  });

  it("shows error state", async () => {
    render(<CourseViewerScreen />);

    await waitFor(() => {
      expect(SecureStore.getItemAsync).toHaveBeenCalled();
    });

    fireEvent.press(screen.getByTestId("error-webview"));

    await waitFor(() => {
      expect(screen.getByText("Content Unavailable")).toBeTruthy();
    });
  });

  it("retries after error", async () => {
    render(<CourseViewerScreen />);

    await waitFor(() => {
      expect(SecureStore.getItemAsync).toHaveBeenCalled();
    });

    fireEvent.press(screen.getByTestId("error-webview"));

    await waitFor(() => {
      expect(screen.getByText("Retry")).toBeTruthy();
    });

    fireEvent.press(screen.getByText("Retry"));

    expect(screen.queryByText("Content Unavailable")).toBeNull();
  });

  it("calls router.back", async () => {
    render(<CourseViewerScreen />);

    await waitFor(() => {
      expect(SecureStore.getItemAsync).toHaveBeenCalled();
    });

    const buttons = screen.UNSAFE_getAllByType(
      require("react-native").TouchableOpacity,
    );

    fireEvent.press(buttons[0]);

    expect(router.back).toHaveBeenCalled();
  });
});

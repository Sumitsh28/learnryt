import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import React from "react";

jest.mock("@/api/client", () => ({
  apiClient: {
    get: jest.fn(),
    patch: jest.fn(),
  },
}));

jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

jest.mock("react-native-reanimated", () => {
  const React = require("react");
  const { View, ScrollView } = require("react-native");

  return {
    __esModule: true,
    default: {
      View,
      ScrollView,
    },
    FadeInDown: {
      duration: () => ({
        delay: () => ({
          springify: () => ({
            damping: () => ({}),
          }),
        }),
        springify: () => ({
          damping: () => ({
            delay: () => ({}),
          }),
        }),
      }),
    },
    FadeInUp: {
      duration: () => ({
        delay: () => ({
          springify: () => ({}),
        }),
      }),
    },
    FadeIn: {
      duration: () => ({
        delay: () => ({}),
      }),
      delay: () => ({}),
    },
    useSharedValue: (v: any) => ({ value: v }),
    useAnimatedStyle: (cb: any) => cb(),
    withSpring: (v: any) => v,
  };
});

import CourseDetailsScreen from "../[id]";

import { useQuery } from "@tanstack/react-query";

import { router } from "expo-router";

import { useAuth } from "../../../../store/useAuth";
import { useBookmarks } from "../../../../store/useBookmarks";
import { useEnrollments } from "../../../../store/useEnrollments";

jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
}));

jest.mock("@/store/useAuth", () => ({
  useAuth: jest.fn(),
}));

jest.mock("../../../../store/useBookmarks", () => ({
  useBookmarks: jest.fn(),
}));

jest.mock("../../../../store/useEnrollments", () => ({
  useEnrollments: jest.fn(),
}));

jest.mock("expo-haptics", () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: "light",
  },
  NotificationFeedbackType: {
    Success: "success",
  },
}));

jest.mock("expo-image", () => ({
  Image: "Image",
}));

jest.mock("react-native-confetti-cannon", () => "Confetti");

jest.mock("expo-router", () => ({
  router: {
    back: jest.fn(),
    push: jest.fn(),
  },
  Stack: {
    Screen: () => null,
  },
  useLocalSearchParams: () => ({
    id: "1",
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

describe("CourseDetailsScreen", () => {
  const mockToggleBookmark = jest.fn();
  const mockEnroll = jest.fn();

  const course = {
    id: "1",
    title: "React Native",
    description: "Mobile development",
    price: 49,
    thumbnail: "thumb",
    rating: "4.8",
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useAuth as unknown as jest.Mock).mockReturnValue({
      user: {
        _id: "1",
      },
    });

    (useBookmarks as unknown as jest.Mock).mockReturnValue({
      toggleBookmark: mockToggleBookmark,
      isBookmarked: jest.fn(() => false),
    });

    (useEnrollments as unknown as jest.Mock).mockReturnValue({
      enroll: mockEnroll,
      checkIsEnrolled: jest.fn(() => false),
    });
  });

  it("shows loading state", () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
    });

    render(<CourseDetailsScreen />);

    expect(screen.UNSAFE_getByType("ActivityIndicator")).toBeTruthy();
  });

  it("shows error state", () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
    });

    render(<CourseDetailsScreen />);

    expect(screen.getByText("Course not found")).toBeTruthy();
  });

  it("renders course details", () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: course,
      isLoading: false,
      isError: false,
    });

    render(<CourseDetailsScreen />);

    expect(screen.getByText("React Native")).toBeTruthy();
    expect(screen.getByText("Mobile development")).toBeTruthy();
    expect(screen.getByText("Course Content")).toBeTruthy();
  });

  it("toggles bookmark", () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: course,
      isLoading: false,
      isError: false,
    });

    render(<CourseDetailsScreen />);

    const buttons = screen.UNSAFE_getAllByType(
      require("react-native").TouchableOpacity,
    );

    fireEvent.press(buttons[1]);

    expect(mockToggleBookmark).toHaveBeenCalledWith("1", "1");
  });

  it("opens ai tutor", () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: course,
      isLoading: false,
      isError: false,
    });

    render(<CourseDetailsScreen />);

    fireEvent.press(screen.getByText("Tutor"));

    expect(router.push).toHaveBeenCalled();
  });

  it("enrolls user", async () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: course,
      isLoading: false,
      isError: false,
    });

    render(<CourseDetailsScreen />);

    fireEvent.press(screen.getByText("Enroll Now"));

    await waitFor(() => {
      expect(mockEnroll).toHaveBeenCalledWith("1", "1");
    });
  });

  it("shows view course for enrolled users", () => {
    (useEnrollments as unknown as jest.Mock).mockReturnValue({
      enroll: mockEnroll,
      checkIsEnrolled: jest.fn(() => true),
    });

    (useQuery as jest.Mock).mockReturnValue({
      data: course,
      isLoading: false,
      isError: false,
    });

    render(<CourseDetailsScreen />);

    expect(screen.getByText("View Course")).toBeTruthy();
  });

  it("calls router.back", () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: course,
      isLoading: false,
      isError: false,
    });

    render(<CourseDetailsScreen />);

    const buttons = screen.UNSAFE_getAllByType(
      require("react-native").TouchableOpacity,
    );

    fireEvent.press(buttons[0]);

    expect(router.back).toHaveBeenCalled();
  });
});

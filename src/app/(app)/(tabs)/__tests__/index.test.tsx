import React from "react";

jest.mock("../../../../api/client", () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

import { fireEvent, render, screen } from "@testing-library/react-native";

import DiscoverScreen from "../index";

import { useQuery } from "@tanstack/react-query";

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

jest.mock("@legendapp/list", () => {
  const React = require("react");

  return {
    LegendList: ({ data, renderItem }: any) => (
      <>
        {data.map((item: any) => (
          <React.Fragment key={item.id}>{renderItem({ item })}</React.Fragment>
        ))}
      </>
    ),
  };
});

jest.mock("expo-router", () => ({
  Link: ({ children }: any) => children,
  router: {
    push: jest.fn(),
  },
}));

jest.mock("expo-image", () => ({
  Image: "Image",
}));

jest.mock("expo-haptics", () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Medium: "medium",
  },
  NotificationFeedbackType: {
    Success: "success",
    Error: "error",
  },
}));

jest.mock("lucide-react-native", () => {
  return new Proxy(
    {},
    {
      get: () => "Icon",
    },
  );
});

describe("DiscoverScreen", () => {
  const mockToggleBookmark = jest.fn();

  const mockCourses = [
    {
      id: "1",
      title: "React Native Mastery",
      description: "Learn mobile development",
      price: 49,
      thumbnail: "thumb",
      instructor: {
        name: "John Doe",
        avatar: "avatar",
      },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    globalThis.fetch = jest.fn();

    (useAuth as unknown as jest.Mock).mockReturnValue({
      user: {
        _id: "1",
        username: "sumit",
      },
    });

    (useBookmarks as unknown as jest.Mock).mockReturnValue({
      toggleBookmark: mockToggleBookmark,
      isBookmarked: jest.fn(() => false),
    });

    (useEnrollments as unknown as jest.Mock).mockReturnValue({
      checkIsEnrolled: jest.fn(() => false),
    });
  });

  it("should show loading state", () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      isFetching: false,
      isError: false,
      refetch: jest.fn(),
    });

    render(<DiscoverScreen />);

    expect(screen.UNSAFE_getByType("ActivityIndicator")).toBeTruthy();
  });

  it("should show error state", () => {
    const mockRefetch = jest.fn();

    (useQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      isFetching: false,
      isError: true,
      refetch: mockRefetch,
    });

    render(<DiscoverScreen />);

    expect(screen.getByText("Network Error")).toBeTruthy();

    fireEvent.press(screen.getByText("Try Again"));

    expect(mockRefetch).toHaveBeenCalled();
  });

  it("should render courses correctly", () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: mockCourses,
      isLoading: false,
      isFetching: false,
      isError: false,
      refetch: jest.fn(),
    });

    render(<DiscoverScreen />);

    expect(screen.getByText("React Native Mastery")).toBeTruthy();

    expect(screen.getByText("8 chapters • 26 lessons")).toBeTruthy();

    expect(screen.getByText("John Doe")).toBeTruthy();
  });

  it("should filter courses using search", () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: mockCourses,
      isLoading: false,
      isFetching: false,
      isError: false,
      refetch: jest.fn(),
    });

    render(<DiscoverScreen />);

    fireEvent.changeText(
      screen.getByPlaceholderText("Search course..."),
      "python",
    );

    expect(
      screen.getByText("No courses found matching that criteria."),
    ).toBeTruthy();
  });

  it("should toggle bookmark", () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: mockCourses,
      isLoading: false,
      isFetching: false,
      isError: false,
      refetch: jest.fn(),
    });

    render(<DiscoverScreen />);

    const bookmarkButton = screen.getByTestId("bookmark-1");

    expect(mockToggleBookmark).toHaveBeenCalledTimes(0);

    fireEvent.press(bookmarkButton);

    expect(mockToggleBookmark).toHaveBeenCalledWith("1", "1");
  });

  it("should show AI smart search results", async () => {
    globalThis.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            choices: [
              {
                message: {
                  content: '["1"]',
                },
              },
            ],
          }),
      }),
    ) as any;

    (useQuery as jest.Mock).mockReturnValue({
      data: mockCourses,
      isLoading: false,
      isFetching: false,
      isError: false,
      refetch: jest.fn(),
    });

    render(<DiscoverScreen />);

    const input = screen.getByPlaceholderText("Search course...");

    fireEvent.changeText(input, "react");

    fireEvent(input, "submitEditing");

    expect(await screen.findByText('AI Results for "react"')).toBeTruthy();

    expect(globalThis.fetch).toHaveBeenCalled();
  });

  it("should render enrolled state correctly", () => {
    (useEnrollments as unknown as jest.Mock).mockReturnValue({
      checkIsEnrolled: jest.fn(() => true),
    });

    (useQuery as jest.Mock).mockReturnValue({
      data: mockCourses,
      isLoading: false,
      isFetching: false,
      isError: false,
      refetch: jest.fn(),
    });

    render(<DiscoverScreen />);

    expect(screen.getByText("Continue ➔")).toBeTruthy();

    expect(screen.getByText("49%")).toBeTruthy();
  });
});

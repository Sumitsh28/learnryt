import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";

import DashboardScreen from "../dashboard";

jest.mock("@/store/useAuth", () => ({
  useAuth: jest.fn(),
}));

jest.mock("@/store/useBookmarks", () => ({
  useBookmarks: jest.fn(),
}));

jest.mock("@/store/useEnrollments", () => ({
  useEnrollments: jest.fn(),
}));

jest.mock("lucide-react-native", () => {
  return new Proxy(
    {},
    {
      get: () => "Icon",
    },
  );
});

jest.mock("react-native-reanimated", () => {
  const React = require("react");

  return {
    __esModule: true,
    default: {
      View: ({ children }: any) => <>{children}</>,
    },
    FadeInDown: {
      duration: () => ({
        delay: () => ({}),
      }),
    },
    FadeInUp: {
      duration: () => ({
        delay: () => ({
          springify: () => ({}),
        }),
        springify: () => ({}),
      }),
    },
  };
});

import { useAuth } from "@/store/useAuth";
import { useBookmarks } from "@/store/useBookmarks";
import { useEnrollments } from "@/store/useEnrollments";

describe("DashboardScreen", () => {
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      user: {
        _id: "1",
        username: "sumit",
      },
    });

    (useBookmarks as jest.Mock).mockReturnValue({
      getUserBookmarks: jest.fn(() => ["1", "2"]),
    });

    (useEnrollments as jest.Mock).mockReturnValue({
      enrollmentsByUser: {
        "1": ["c1", "c2", "c3"],
      },
    });
  });

  it("renders dashboard data", () => {
    render(<DashboardScreen />);

    expect(screen.getByText("Your Progress")).toBeTruthy();

    expect(screen.getByText("Keep up the great work, sumit!")).toBeTruthy();

    expect(screen.getByText("2,500")).toBeTruthy();

    expect(screen.getByText("14")).toBeTruthy();
  });

  it("toggles timeframe", () => {
    render(<DashboardScreen />);

    fireEvent.press(screen.getByText("This Week"));

    expect(screen.getByText("This Month")).toBeTruthy();
  });

  it("claims reward", () => {
    render(<DashboardScreen />);

    fireEvent.press(screen.getByText("Claim +50 Points"));

    expect(screen.getByText("Reward Claimed")).toBeTruthy();

    expect(screen.getByText("2,550")).toBeTruthy();

    expect(screen.getByText("15")).toBeTruthy();
  });
});

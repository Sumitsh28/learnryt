import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";

import WelcomeScreen from "../welcome";

jest.mock("expo-router", () => ({
  Link: ({ children }: any) => children,
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

  const animationMock = {
    duration: () => animationMock,
    delay: () => animationMock,
    springify: () => animationMock,
    damping: () => animationMock,
  };

  return {
    __esModule: true,
    default: {
      View: ({ children }: any) => <>{children}</>,
      ScrollView: ({ children, onScroll }: any) => (
        <div onScroll={onScroll}>{children}</div>
      ),
    },
    FadeIn: animationMock,
    FadeInDown: animationMock,
    FadeInUp: animationMock,
  };
});

describe("WelcomeScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders onboarding content", () => {
    render(<WelcomeScreen />);

    expect(screen.getByText("Learn")).toBeTruthy();
    expect(screen.getByText("Dream")).toBeTruthy();
    expect(screen.getByText("Achieve.")).toBeTruthy();

    expect(screen.getByText("Start Learning")).toBeTruthy();

    expect(screen.getByText("I already have an account")).toBeTruthy();
  });

  it("renders all slides", () => {
    render(<WelcomeScreen />);

    expect(screen.getByText("Build")).toBeTruthy();
    expect(screen.getByText("Grow")).toBeTruthy();
    expect(screen.getByText("Succeed.")).toBeTruthy();

    expect(screen.getByText("Track")).toBeTruthy();
    expect(screen.getByText("Earn")).toBeTruthy();
    expect(screen.getByText("Flex.")).toBeTruthy();
  });

  it("handles scroll event", () => {
    render(<WelcomeScreen />);

    const scrollView = screen.UNSAFE_getByType("div");

    fireEvent.scroll(scrollView, {
      nativeEvent: {
        contentOffset: {
          x: 400,
        },
      },
    });

    expect(scrollView).toBeTruthy();
  });
});

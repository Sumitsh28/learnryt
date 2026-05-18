import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import React from "react";

import LoginScreen from "../login";

import { apiClient } from "../../../api/client";
import { useAuth } from "../../../store/useAuth";

jest.mock("expo-router", () => ({
  Link: ({ children }: any) => children,
}));

jest.mock("../../../api/client", () => ({
  apiClient: {
    post: jest.fn(),
  },
}));

jest.mock("../../../store/useAuth", () => ({
  useAuth: jest.fn(),
}));

describe("LoginScreen", () => {
  const mockLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useAuth as unknown as jest.Mock).mockImplementation((selector: any) =>
      selector({
        login: mockLogin,
      }),
    );
  });

  it("should render login screen correctly", () => {
    render(<LoginScreen />);

    expect(screen.getByText("Welcome Back")).toBeTruthy();

    expect(screen.getByPlaceholderText("name@example.com")).toBeTruthy();

    expect(screen.getByPlaceholderText("••••••••")).toBeTruthy();

    expect(screen.getByText("Sign In")).toBeTruthy();
  });

  it("should show validation errors", async () => {
    render(<LoginScreen />);

    fireEvent.press(screen.getByText("Sign In"));

    await waitFor(() => {
      expect(
        screen.getByText("Please enter a valid email address"),
      ).toBeTruthy();

      expect(
        screen.getByText("Password must be at least 6 characters"),
      ).toBeTruthy();
    });
  });

  it("should login successfully", async () => {
    (apiClient.post as jest.Mock).mockResolvedValue({
      data: {
        data: {
          user: {
            _id: "1",
            username: "sumit",
          },
          accessToken: "access-token",
          refreshToken: "refresh-token",
        },
      },
    });

    render(<LoginScreen />);

    fireEvent.changeText(
      screen.getByPlaceholderText("name@example.com"),
      "sumit@test.com",
    );

    fireEvent.changeText(screen.getByPlaceholderText("••••••••"), "123456");

    fireEvent.press(screen.getByText("Sign In"));

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith("/users/login", {
        email: "sumit@test.com",
        password: "123456",
      });
    });

    expect(mockLogin).toHaveBeenCalledWith(
      {
        _id: "1",
        username: "sumit",
      },
      "access-token",
      "refresh-token",
    );
  });

  it("should show server error on failed login", async () => {
    (apiClient.post as jest.Mock).mockRejectedValue({
      response: {
        data: {
          message: "Invalid credentials",
        },
      },
    });

    render(<LoginScreen />);

    fireEvent.changeText(
      screen.getByPlaceholderText("name@example.com"),
      "sumit@test.com",
    );

    fireEvent.changeText(screen.getByPlaceholderText("••••••••"), "123456");

    fireEvent.press(screen.getByText("Sign In"));

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeTruthy();
    });
  });
});

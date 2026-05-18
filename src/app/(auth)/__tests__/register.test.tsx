import React from "react";

import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";

import RegisterScreen from "../register";

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

describe("RegisterScreen", () => {
  const mockLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useAuth as unknown as jest.Mock).mockImplementation((selector: any) =>
      selector({
        login: mockLogin,
      }),
    );
  });

  it("should render register screen correctly", () => {
    render(<RegisterScreen />);

    expect(screen.getByText("Create Account")).toBeTruthy();

    expect(screen.getByPlaceholderText("creative_genius")).toBeTruthy();

    expect(screen.getByPlaceholderText("name@example.com")).toBeTruthy();

    expect(screen.getByPlaceholderText("••••••••")).toBeTruthy();

    expect(screen.getByText("Sign Up")).toBeTruthy();
  });

  it("should show validation errors", async () => {
    render(<RegisterScreen />);

    fireEvent.press(screen.getByText("Sign Up"));

    await waitFor(() => {
      expect(
        screen.getByText("Username must be at least 3 characters"),
      ).toBeTruthy();

      expect(
        screen.getByText("Please enter a valid email address"),
      ).toBeTruthy();

      expect(
        screen.getByText("Password must be at least 6 characters"),
      ).toBeTruthy();
    });
  });

  it("should register and login successfully", async () => {
    (apiClient.post as jest.Mock)
      .mockResolvedValueOnce({
        data: {
          success: true,
        },
      })
      .mockResolvedValueOnce({
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

    render(<RegisterScreen />);

    fireEvent.changeText(
      screen.getByPlaceholderText("creative_genius"),
      "sumit",
    );

    fireEvent.changeText(
      screen.getByPlaceholderText("name@example.com"),
      "sumit@test.com",
    );

    fireEvent.changeText(screen.getByPlaceholderText("••••••••"), "123456");

    fireEvent.press(screen.getByText("Sign Up"));

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenNthCalledWith(1, "/users/register", {
        username: "sumit",
        email: "sumit@test.com",
        password: "123456",
        role: "USER",
      });
    });

    expect(apiClient.post).toHaveBeenNthCalledWith(2, "/users/login", {
      email: "sumit@test.com",
      password: "123456",
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

  it("should show server error on failed register", async () => {
    (apiClient.post as jest.Mock).mockRejectedValue({
      response: {
        data: {
          message: "Email already exists",
        },
      },
    });

    render(<RegisterScreen />);

    fireEvent.changeText(
      screen.getByPlaceholderText("creative_genius"),
      "sumit",
    );

    fireEvent.changeText(
      screen.getByPlaceholderText("name@example.com"),
      "sumit@test.com",
    );

    fireEvent.changeText(screen.getByPlaceholderText("••••••••"), "123456");

    fireEvent.press(screen.getByText("Sign Up"));

    await waitFor(() => {
      expect(screen.getByText("Email already exists")).toBeTruthy();
    });
  });
});

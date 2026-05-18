jest.unmock("../useAuth");

import { act } from "@testing-library/react-native";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

import { queryClient } from "@/api/queryClient";
import { apiClient } from "../../api/client";

import { useAuth } from "../useAuth";

jest.mock("expo-secure-store", () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

jest.mock("expo-router", () => ({
  router: {
    replace: jest.fn(),
  },
}));

jest.mock("@/api/queryClient", () => ({
  queryClient: {
    clear: jest.fn(),
  },
}));

jest.mock("../../api/client", () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

describe("useAuth Store", () => {
  const mockUser = {
    _id: "1",
    username: "sumit",
    email: "sumit@test.com",
    avatar: {
      url: "url",
      localPath: "path",
    },
    role: "student",
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useAuth.setState({
      user: null,
      isAuthenticated: false,
      isLoading: true,
    });
  });

  it("should login user successfully", async () => {
    await act(async () => {
      await useAuth.getState().login(mockUser, "access-token", "refresh-token");
    });

    expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
      "accessToken",
      "access-token",
    );

    expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
      "refreshToken",
      "refresh-token",
    );

    expect(useAuth.getState().user).toEqual(mockUser);

    expect(useAuth.getState().isAuthenticated).toBe(true);

    expect(router.replace).toHaveBeenCalledWith("/(app)/(tabs)");
  });

  it("should logout user successfully", async () => {
    useAuth.setState({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
    });

    await act(async () => {
      await useAuth.getState().logout();
    });

    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("accessToken");

    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("refreshToken");

    expect(queryClient.clear).toHaveBeenCalled();

    expect(useAuth.getState().user).toBeNull();

    expect(useAuth.getState().isAuthenticated).toBe(false);

    expect(router.replace).toHaveBeenCalledWith("/(auth)/login");
  });

  it("should hydrate authenticated user", async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue("valid-token");

    (apiClient.get as jest.Mock).mockResolvedValue({
      data: {
        data: mockUser,
      },
    });

    await act(async () => {
      await useAuth.getState().hydrate();
    });

    expect(useAuth.getState().isAuthenticated).toBe(true);

    expect(useAuth.getState().user).toEqual(mockUser);

    expect(useAuth.getState().isLoading).toBe(false);
  });

  it("should handle missing token during hydrate", async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);

    await act(async () => {
      await useAuth.getState().hydrate();
    });

    expect(useAuth.getState().isAuthenticated).toBe(false);

    expect(useAuth.getState().isLoading).toBe(false);
  });

  it("should handle hydrate API failure", async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue("bad-token");

    (apiClient.get as jest.Mock).mockRejectedValue(new Error("Unauthorized"));

    await act(async () => {
      await useAuth.getState().hydrate();
    });

    expect(queryClient.clear).toHaveBeenCalled();

    expect(SecureStore.deleteItemAsync).toHaveBeenCalled();

    expect(useAuth.getState().user).toBeNull();

    expect(useAuth.getState().isAuthenticated).toBe(false);
  });

  it("should update user fields", () => {
    useAuth.setState({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
    });

    act(() => {
      useAuth.getState().updateUser({
        username: "updated",
      });
    });

    expect(useAuth.getState().user?.username).toBe("updated");
  });
});

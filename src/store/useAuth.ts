import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { apiClient } from "../api/client";

export interface User {
  _id: string;
  username: string;
  email: string;
  avatar: { url: string; localPath: string };
  role: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    userData: User,
    accessToken: string,
    refreshToken: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (userData, accessToken, refreshToken) => {
    await SecureStore.setItemAsync("accessToken", accessToken);
    await SecureStore.setItemAsync("refreshToken", refreshToken);

    set({ user: userData, isAuthenticated: true });

    router.replace("/(app)/(tabs)");
  },

  logout: async () => {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");

    // TODO: Later we will add queryClient.clear() here to wipe React Query cache
    set({ user: null, isAuthenticated: false });

    router.replace("/(auth)/login");
  },

  hydrate: async () => {
    try {
      const token = await SecureStore.getItemAsync("accessToken");
      if (!token) {
        set({ isLoading: false, isAuthenticated: false });
        return;
      }

      const { data } = await apiClient.get("/users/current-user");

      set({ user: data.data, isAuthenticated: true, isLoading: false });
    } catch (error) {
      console.error(
        "Hydration failed (Token expired or network error):",
        error,
      );
      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("refreshToken");
      set({ isLoading: false, isAuthenticated: false, user: null });
    }
  },
}));

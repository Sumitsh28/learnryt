import { queryClient } from "@/api/queryClient";
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
  updateUser: (updatedFields: Partial<User>) => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  updateUser: (updatedFields) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updatedFields } : null,
    })),

  login: async (userData, accessToken, refreshToken) => {
    console.log("🔑 LOGGING IN: Storing tokens in SecureStore...");
    await SecureStore.setItemAsync("accessToken", accessToken);
    await SecureStore.setItemAsync("refreshToken", refreshToken);

    set({ user: userData, isAuthenticated: true });

    console.log(`✅ LOGIN SUCCESS: Welcome back, ${userData.username}`);
    router.replace("/(app)/(tabs)");
  },

  logout: async () => {
    console.log("🚪 LOGGING OUT: Wiping tokens and local state...");
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");

    queryClient.clear();
    console.log("🧹 CACHE CLEARED: All React Query data has been wiped.");

    set({ user: null, isAuthenticated: false });

    router.replace("/(auth)/login");
  },

  hydrate: async () => {
    try {
      console.log("🔄 HYDRATION: Checking SecureStore for existing tokens...");
      const token = await SecureStore.getItemAsync("accessToken");

      if (!token) {
        console.log("⚠️ HYDRATION: No token found. Routing to welcome screen.");
        set({ isLoading: false, isAuthenticated: false });
        return;
      }

      console.log("✅ HYDRATION: Token found! Verifying session with API...");
      const { data } = await apiClient.get("/users/current-user");

      console.log("👤 SESSION VALID: Logged in as ->", data.data.username);
      set({ user: data.data, isAuthenticated: true, isLoading: false });
    } catch (error) {
      console.error(
        "❌ HYDRATION FAILED: Token expired or network error.",
        error,
      );

      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("refreshToken");
      queryClient.clear();

      set({ isLoading: false, isAuthenticated: false, user: null });
    }
  },
}));

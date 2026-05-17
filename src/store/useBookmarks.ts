import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface BookmarkState {
  bookmarksByUser: Record<string, string[]>;

  milestonesReached: string[];

  toggleBookmark: (userId: string, courseId: string) => void;
  isBookmarked: (userId: string | undefined, courseId: string) => boolean;
  getUserBookmarks: (userId: string | undefined) => string[];
}

export const useBookmarks = create<BookmarkState>()(
  persist(
    (set, get) => ({
      bookmarksByUser: {},
      milestonesReached: [],

      toggleBookmark: (userId, courseId) => {
        if (!userId) return; // Failsafe

        const state = get();
        const userBookmarks = state.bookmarksByUser[userId] || [];
        const exists = userBookmarks.includes(courseId);

        const newBookmarks = exists
          ? userBookmarks.filter((id) => id !== courseId)
          : [...userBookmarks, courseId];

        set((state) => ({
          bookmarksByUser: {
            ...state.bookmarksByUser,
            [userId]: newBookmarks,
          },
        }));

        if (
          !exists &&
          newBookmarks.length >= 5 &&
          !state.milestonesReached.includes(userId)
        ) {
          set((state) => ({
            milestonesReached: [...state.milestonesReached, userId],
          }));

          Notifications.scheduleNotificationAsync({
            content: {
              title: "Curator Status Achieved! 🏆",
              body: "You've bookmarked 5+ courses. You're building an incredible learning library.",
            },
            trigger: null,
          }).catch((err) => {
            console.log("Notification bypassed:", err.message);
          });
        }
      },

      isBookmarked: (userId, courseId) => {
        if (!userId) return false;
        const userBookmarks = get().bookmarksByUser[userId] || [];
        return userBookmarks.includes(courseId);
      },

      getUserBookmarks: (userId) => {
        if (!userId) return [];
        return get().bookmarksByUser[userId] || [];
      },
    }),
    {
      name: "elite-bookmarks-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface BookmarkState {
  bookmarkedIds: string[];
  hasReachedMilestone: boolean;
  toggleBookmark: (courseId: string) => void;
  isBookmarked: (courseId: string) => boolean;
}

export const useBookmarks = create<BookmarkState>()(
  persist(
    (set, get) => ({
      bookmarkedIds: [],
      hasReachedMilestone: false,

      toggleBookmark: async (courseId) => {
        const state = get();
        const exists = state.bookmarkedIds.includes(courseId);

        let newBookmarks;
        if (exists) {
          newBookmarks = state.bookmarkedIds.filter((id) => id !== courseId);
        } else {
          newBookmarks = [...state.bookmarkedIds, courseId];

          if (newBookmarks.length === 5 && !state.hasReachedMilestone) {
            await Notifications.scheduleNotificationAsync({
              content: {
                title: "Curator Status Achieved! 🏆",
                body: "You've bookmarked 5 courses. You're building an incredible learning library.",
              },
              trigger: null,
            });
            set({ hasReachedMilestone: true });
          }
        }

        set({ bookmarkedIds: newBookmarks });
      },

      isBookmarked: (courseId) => {
        return get().bookmarkedIds.includes(courseId);
      },
    }),
    {
      name: "elite-bookmarks-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

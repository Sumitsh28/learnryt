import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface BookmarkState {
  bookmarkedIds: string[];
  toggleBookmark: (courseId: string) => void;
  isBookmarked: (courseId: string) => boolean;
}

export const useBookmarks = create<BookmarkState>()(
  persist(
    (set, get) => ({
      bookmarkedIds: [],

      toggleBookmark: (courseId) => {
        set((state) => {
          const exists = state.bookmarkedIds.includes(courseId);
          if (exists) {
            return {
              bookmarkedIds: state.bookmarkedIds.filter(
                (id) => id !== courseId,
              ),
            };
          } else {
            return { bookmarkedIds: [...state.bookmarkedIds, courseId] };
          }
        });
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

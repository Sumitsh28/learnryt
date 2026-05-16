import { MMKV } from "react-native-mmkv";
import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";

const storage = new MMKV();

const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    return storage.set(name, value);
  },
  getItem: (name) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name) => {
    return storage.delete(name);
  },
};

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
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);

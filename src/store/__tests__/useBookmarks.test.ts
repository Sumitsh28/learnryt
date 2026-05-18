import { act } from "@testing-library/react-native";

import * as Notifications from "expo-notifications";

import { useBookmarks } from "../useBookmarks";

jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock("expo-notifications", () => ({
  scheduleNotificationAsync: jest.fn(() => Promise.resolve()),
}));

describe("useBookmarks Store", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useBookmarks.setState({
      bookmarksByUser: {},
      milestonesReached: [],
    });
  });

  it("should add bookmark", () => {
    act(() => {
      useBookmarks.getState().toggleBookmark("u1", "c1");
    });

    expect(useBookmarks.getState().isBookmarked("u1", "c1")).toBe(true);
  });

  it("should remove bookmark", () => {
    act(() => {
      useBookmarks.getState().toggleBookmark("u1", "c1");

      useBookmarks.getState().toggleBookmark("u1", "c1");
    });

    expect(useBookmarks.getState().isBookmarked("u1", "c1")).toBe(false);
  });

  it("should ignore missing userId", () => {
    act(() => {
      useBookmarks.getState().toggleBookmark("" as any, "c1");
    });

    expect(useBookmarks.getState().bookmarksByUser).toEqual({});
  });

  it("should trigger milestone notification", () => {
    act(() => {
      for (let i = 1; i <= 5; i++) {
        useBookmarks.getState().toggleBookmark("u1", `c${i}`);
      }
    });

    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalled();

    expect(useBookmarks.getState().milestonesReached.includes("u1")).toBe(true);
  });

  it("should return user bookmarks", () => {
    act(() => {
      useBookmarks.getState().toggleBookmark("u1", "c1");
    });

    expect(useBookmarks.getState().getUserBookmarks("u1")).toEqual(["c1"]);
  });

  it("should return empty bookmarks for undefined user", () => {
    expect(useBookmarks.getState().getUserBookmarks(undefined)).toEqual([]);
  });
});

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

import { act } from "@testing-library/react-native";

import { useEnrollments } from "../useEnrollments";

describe("useEnrollments", () => {
  beforeEach(() => {
    useEnrollments.setState({
      enrollmentsByUser: {},
    });
  });

  it("should enroll in course", () => {
    act(() => {
      useEnrollments.getState().enroll("1", "101");
    });

    expect(useEnrollments.getState().enrollmentsByUser).toEqual({
      "1": ["101"],
    });
  });

  it("should check enrollment correctly", () => {
    act(() => {
      useEnrollments.getState().enroll("1", "101");
    });

    expect(useEnrollments.getState().checkIsEnrolled("1", "101")).toBe(true);

    expect(useEnrollments.getState().checkIsEnrolled("1", "999")).toBe(false);
  });
});

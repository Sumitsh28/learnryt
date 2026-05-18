import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface EnrollmentState {
  enrollmentsByUser: Record<string, string[]>;
  enroll: (userId: string, courseId: string) => void;
  checkIsEnrolled: (userId: string | undefined, courseId: string) => boolean;
}

export const useEnrollments = create<EnrollmentState>()(
  persist(
    (set, get) => ({
      enrollmentsByUser: {},

      enroll: (userId, courseId) => {
        if (!userId) return;

        const currentUserEnrollments = get().enrollmentsByUser[userId] || [];

        if (!currentUserEnrollments.includes(courseId)) {
          set((state) => ({
            enrollmentsByUser: {
              ...state.enrollmentsByUser,
              [userId]: [...currentUserEnrollments, courseId],
            },
          }));
        }
      },

      checkIsEnrolled: (userId, courseId) => {
        if (!userId) return false;

        const userEnrollments = get().enrollmentsByUser[userId] || [];
        return userEnrollments.includes(courseId);
      },
    }),
    {
      name: "elite-enrollments-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

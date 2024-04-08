import { StoredCourse } from "@/app/types/Course";
import { Term } from "@prisma/client";
import { create } from "zustand";

// A Zustand store that keeps track of the modals that need global state

// NOTE: not all modals need to be in this store, only those that need to be
// controlled from multiple components.

type Modals = {
  // CourseInfoModal
  showCourseInfoModal: boolean;
  setShowCourseInfoModal: (show: boolean) => void;
  courseInfoDisplayCourse?: StoredCourse;
  setCourseInfoDisplayCourse: (show?: StoredCourse) => void;
  courseInfoDisplayTerm?: Term;
  setCourseInfoDisplayTerm: (term?: Term) => void;
  courseInfoViewOnly?: boolean;
  setCouseInfoViewOnly: (viewOnly: boolean) => void;
};

const useModalsStore = create<Modals>((set) => ({
  showCourseInfoModal: false,
  setShowCourseInfoModal: (show: boolean) => set({ showCourseInfoModal: show }),
  courseInfoDisplayCourseInfo: undefined,
  setCourseInfoDisplayCourse: (course?: StoredCourse) =>
    set({ courseInfoDisplayCourse: course }),
  courseInfodisplayTerm: undefined,
  setCourseInfoDisplayTerm: (term?: Term) =>
    set({ courseInfoDisplayTerm: term }),
  courseInfoViewOnly: false,
  setCouseInfoViewOnly: (viewOnly: boolean) =>
    set({ courseInfoViewOnly: viewOnly }),
}));

export default useModalsStore;

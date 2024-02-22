import { createContext, useState } from "react";

import { SetShow, SetState } from "../types/Common";
import { StoredCourse } from "../types/Course";
import { Term } from "../types/Quarter";

export interface CourseInfoContextProps {
  showCourseInfoModal: boolean;
  setShowCourseInfoModal: SetShow;
  displayCourse: [StoredCourse, Term | undefined] | undefined;
  setDisplayCourse: SetState<[StoredCourse, Term | undefined] | undefined>;
  onShowCourseInfoModal: () => void;
}

export const CourseInfoContext = createContext({} as CourseInfoContextProps);

export function CourseInfoProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showCourseInfoModal, setShowCourseInfoModal] = useState(false);
  const [displayCourse, setDisplayCourse] = useState<
    [StoredCourse, Term | undefined] | undefined
  >();

  return (
    <CourseInfoContext.Provider
      value={{
        showCourseInfoModal,
        setShowCourseInfoModal,
        displayCourse,
        setDisplayCourse,
        onShowCourseInfoModal: () => setShowCourseInfoModal(true),
      }}
    >
      {children}
    </CourseInfoContext.Provider>
  );
}

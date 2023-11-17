import { createContext, useContext } from "react";
import { PlannerContext } from "./PlannerProvider";
import { ModalsContextProps } from "../types/Context";
import useModals from "../hooks/useModals";

export const ModalsContext = createContext({} as ModalsContextProps);

export function ModalsProvider({ children }: { children: React.ReactNode }) {
  const {
    showMajorCompletionModal,
    setShowMajorCompletionModal,
    showExportModal,
    setShowExportModal,
    showCourseInfoModal,
    setShowCourseInfoModal,
    displayCourse,
    setDisplayCourse,
    onShowCourseInfoModal,
  } = useModals();

  const { courseState } = useContext(PlannerContext);

  return (
    <ModalsContext.Provider
      value={{
        showMajorCompletionModal,
        setShowMajorCompletionModal,
        showExportModal,
        setShowExportModal,
        showCourseInfoModal,
        setShowCourseInfoModal,
        displayCourse,
        setDisplayCourse,
        onShowCourseInfoModal,
        courseState,
      }}
    >
      {children}
    </ModalsContext.Provider>
  );
}

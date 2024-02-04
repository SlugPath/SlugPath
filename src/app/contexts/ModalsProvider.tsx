import useModals from "@components/modals/useModals";
import { ModalsContextProps } from "@customTypes/Context";
import { createContext, useContext } from "react";

import { PlannerContext } from "./PlannerProvider";

export const ModalsContext = createContext({} as ModalsContextProps);

export function ModalsProvider({ children }: { children: React.ReactNode }) {
  const {
    showExportModal,
    setShowExportModal,
    showCourseInfoModal,
    setShowCourseInfoModal,
    onShowCourseInfoModal,
    showMajorSelectionModal,
    setShowMajorSelectionModal,
    displayCourse,
    setDisplayCourse,
    showMajorProgressModal,
    setShowMajorProgressModal,
    showPermissionsModal,
    setShowPermissionsModal,
  } = useModals();

  const { courseState } = useContext(PlannerContext);

  return (
    <ModalsContext.Provider
      value={{
        showExportModal,
        setShowExportModal,
        showCourseInfoModal,
        displayCourse,
        setDisplayCourse,
        setShowCourseInfoModal,
        onShowCourseInfoModal,
        showMajorSelectionModal,
        setShowMajorSelectionModal,
        showMajorProgressModal,
        setShowMajorProgressModal,
        courseState,
        showPermissionsModal,
        setShowPermissionsModal,
      }}
    >
      {children}
    </ModalsContext.Provider>
  );
}

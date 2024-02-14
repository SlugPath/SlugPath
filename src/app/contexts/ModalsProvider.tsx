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
    displayCourse,
    setDisplayCourse,
    majorToEdit,
    setMajorToEdit,
    showMajorsModal,
    setShowMajorsModal,
    showMajorRequirementsEditModal,
    setShowMajorRequirementsEditModal,
    showPermissionsModal,
    setShowPermissionsModal,
    showReplaceRLModal,
    setShowReplaceRLModal,
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
        majorToEdit,
        setMajorToEdit,
        setShowCourseInfoModal,
        onShowCourseInfoModal,
        showMajorsModal,
        setShowMajorsModal,
        showMajorRequirementsEditModal,
        setShowMajorRequirementsEditModal,
        showPermissionsModal,
        setShowPermissionsModal,
        showReplaceRLModal,
        setShowReplaceRLModal,
        courseState,
      }}
    >
      {children}
    </ModalsContext.Provider>
  );
}

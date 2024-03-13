import { PlannerContext } from "@contexts/PlannerProvider";
import { createContext, useContext } from "react";

import useModals from "../../hooks/useModals";
import { ModalsContextProps } from "./Types";

export const ModalsContext = createContext({} as ModalsContextProps);

export function ModalsProvider({ children }: { children: React.ReactNode }) {
  const {
    showExportModal,
    setShowExportModal,
    showMajorsModal,
    setShowMajorsModal,
    showPermissionsModal,
    setShowPermissionsModal,
    showReplaceRLModal,
    setShowReplaceRLModal,
    showMajorRequirementsEditModal,
    setShowMajorRequirementsEditModal,
    majorToEdit,
    setMajorToEdit,
  } = useModals();

  const { courseState } = useContext(PlannerContext);

  return (
    <ModalsContext.Provider
      value={{
        showExportModal,
        setShowExportModal,
        showMajorsModal,
        setShowMajorsModal,
        showPermissionsModal,
        setShowPermissionsModal,
        showReplaceRLModal,
        setShowReplaceRLModal,
        showMajorRequirementsEditModal,
        setShowMajorRequirementsEditModal,
        courseState,
        majorToEdit,
        setMajorToEdit,
      }}
    >
      {children}
    </ModalsContext.Provider>
  );
}

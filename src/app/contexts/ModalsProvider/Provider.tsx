import { PlannerContext } from "@contexts/PlannerProvider";
import { createContext, useContext } from "react";

import { ModalsContextProps } from "./Types";
import useModals from "./useModals";

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
    showSuggestionsModal,
    setShowSuggestionsModal,
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
        showSuggestionsModal,
        setShowSuggestionsModal,
        courseState,
        majorToEdit,
        setMajorToEdit,
      }}
    >
      {children}
    </ModalsContext.Provider>
  );
}

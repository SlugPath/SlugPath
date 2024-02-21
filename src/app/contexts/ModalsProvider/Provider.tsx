import { PlannerContext } from "@contexts/PlannerProvider";
import { createContext, useContext } from "react";

import { ModalsContextProps } from "./Types";
import useModals from "./useModals";

export const ModalsContext = createContext({} as ModalsContextProps);

export function ModalsProvider({ children }: { children: React.ReactNode }) {
  const {
    showExportModal,
    setShowExportModal,
    showMajorSelectionModal,
    setShowMajorSelectionModal,
    showMajorProgressModal,
    setShowMajorProgressModal,
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
        showMajorSelectionModal,
        setShowMajorSelectionModal,
        showMajorProgressModal,
        setShowMajorProgressModal,
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

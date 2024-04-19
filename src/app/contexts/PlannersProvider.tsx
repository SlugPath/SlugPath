import { SetShow, SetState } from "@customTypes/Common";
import { PlannerData } from "@customTypes/Planner";
import { createContext, useState } from "react";

export interface MultiPlanner {
  planners: PlannerData[];
  activePlanner: string | undefined;
}

export interface PlannersContextProps {
  showExportModal: boolean;
  setShowExportModal: SetState<boolean>;
  showShareModal: boolean;
  setShowShareModal: SetShow;
}

export interface PlannersProviderProps {
  children: React.ReactNode;
}

export const PlannersContext = createContext({} as PlannersContextProps);

export function PlannersProvider({ children }: PlannersProviderProps) {
  const [showExportModal, setShowExportModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  return (
    <PlannersContext.Provider
      value={{
        showExportModal,
        setShowExportModal,
        showShareModal,
        setShowShareModal,
      }}
    >
      {children}
    </PlannersContext.Provider>
  );
}

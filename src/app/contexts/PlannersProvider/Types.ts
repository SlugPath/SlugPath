import { PlannerData } from "@customTypes/Planner";

import { SetState } from "../../types/Common";

export interface MultiPlanner {
  planners: PlannerData[];
  activePlanner: string | undefined;
}

export interface PlannersContextProps {
  planners: PlannerData[];
  removePlanner: (plannerId: string) => void;
  addPlanner: () => void;
  getPlanner: (id: string) => PlannerData;
  setPlanner: (id: string, courseState: PlannerData) => void;
  switchPlanners: (id: string) => void;
  changePlannerName: (id: string, newTitle: string) => void;
  replaceCurrentPlanner: () => void;
  duplicatePlanner: (id: string) => void;
  activePlanner: string | undefined;
  deletedPlanner: boolean;
  showExportModal: boolean;
  setShowExportModal: SetState<boolean>;
}

export interface PlannersProviderProps {
  allPlanners: PlannerData[];
  children: React.ReactNode;
}

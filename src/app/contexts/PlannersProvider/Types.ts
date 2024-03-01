import { SetShow } from "@customTypes/Common";
import { PlannerData } from "@customTypes/Planner";

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
  showExportModal: boolean;
  setShowExportModal: SetShow;
  showShareModal: boolean;
  setShowShareModal: SetShow;
}

export interface PlannersProviderProps {
  allPlanners: PlannerData[];
  children: React.ReactNode;
}

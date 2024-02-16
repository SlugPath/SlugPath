import { PlannerData } from "@customTypes/Planner";

export interface PlannersContextProps {
  planners: PlannerData[];
  removePlanner: (plannerId: string) => void;
  addPlanner: () => void;
  getPlanner: (id: string) => PlannerData;
  setPlanner: (id: string, title: string, courseState: PlannerData) => void;
  switchPlanners: (id: string) => void;
  changePlannerName: (id: string, newTitle: string) => void;
  replaceCurrentPlanner: () => void;
  activePlanner: string | undefined;
  deletedPlanner: boolean;
}

export interface PlannersProviderProps {
  allPlanners: PlannerData[];
  children: React.ReactNode;
}

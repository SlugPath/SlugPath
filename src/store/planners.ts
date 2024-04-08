import { PlannerData } from "@/app/types/Planner";
import { create } from "zustand";

// A Zustand store that keeps track of the local planners and active planner id.

// NOTE: Since planner data is only saved every 30 seconds and on unload, there
// is a need for a local store in addition to React Query cache.

export const MAX_PLANNERS = 10;

type Planners = {
  planners: PlannerData[];
  setPlanner: (plannerId: string, planner: PlannerData) => boolean;
  setPlanners: (planners: PlannerData[]) => boolean;
  addPlanner: (planner: PlannerData) => boolean;
  deletePlanner: (plannerId: string) => boolean;

  activePlannerId: string | undefined;
  setActivePlannerId: (plannerId: string | undefined) => void;
};

const usePlannersStore = create<Planners>((set) => ({
  planners: [],

  /**
   * Sets a planner in the store
   * @param plannerId a unique planner id
   * @param newPlanner a PlannerData object
   * @returns true if the planner was found and updated, false otherwise
   */
  setPlanner: (plannerId: string, newPlanner: PlannerData) => {
    console.log("planner store: Setting planner", plannerId, newPlanner);

    let success = false;
    set((state) => ({
      planners: state.planners.map((oldPlanner) => {
        if (oldPlanner.id === plannerId) {
          success = true;
          return newPlanner;
        }
        return oldPlanner;
      }),
    }));
    return success;
  },

  /**
   * Replaces all planners in the store, then sets the active planner to the
   * first planner
   * @param planners an array of PlannerData objects
   * @returns true if the planners were updated, false otherwise
   */
  setPlanners: (planners: PlannerData[]) => {
    console.log("planner store: Setting planners", planners);

    set({ planners, activePlannerId: planners[0]?.id });
    return true;
  },

  /**
   * Adds a planner to the store then sets it as active
   * @param planner a PlannerData object
   * @returns true if the planner was added, false otherwise
   */
  addPlanner: (planner: PlannerData) => {
    console.log("planner store: Adding planner", planner);

    let success = false;
    set((state) => {
      if (state.planners.length >= MAX_PLANNERS) return state;

      success = true;
      return {
        planners: [...state.planners, planner],
        activePlannerId: planner.id,
      };
    });
    return success;
  },

  /**
   * Deletes a planner from the store then updates the active planner
   * @param plannerId a unique planner id
   * @returns true if the planner was found and deleted, false otherwise
   */
  deletePlanner: (plannerId: string) => {
    console.log("planner store: Deleting planner", plannerId);

    let success = false;
    set((state) => {
      const plannerIdx = state.planners.findIndex((p) => p.id === plannerId);
      const newPlanners = state.planners.filter((planner) => {
        if (planner.id === plannerId) {
          success = true;
          return false;
        }
        return true;
      });
      const newActivePlannerId =
        newPlanners[plannerIdx]?.id ?? newPlanners[plannerIdx - 1]?.id;

      return { planners: newPlanners, activePlannerId: newActivePlannerId };
    });
    return success;
  },

  activePlannerId: undefined,
  setActivePlannerId: (id: string | undefined) => set({ activePlannerId: id }),
}));

export default usePlannersStore;

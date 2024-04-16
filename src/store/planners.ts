import { PlannerData } from "@/app/types/Planner";
import { createStore } from "zustand";

// A Zustand store that keeps track of the local planners and active planner id.

// NOTE: Since planner data is only saved every 30 seconds and on unload, there
// is a need for a local store in addition to React Query cache. See client /
// server planner syncronization in `usePlannerSync.ts` for more details.

// NOTE: In order to skip inital syncronization load time, this store needs to
// accept initial data from the server. This means the store created must be an
// object (using `createStore`) instead of a custom hook (using `create`). A
// context is then needed to access this store. See context provider in
// `PlannersProvider.tsx` for more details.
// https://tuffstuff9.hashnode.dev/zustand-create-vs-createstore

export const MAX_PLANNERS = 10;

interface PlannersProps {
  planners: PlannerData[];
  activePlannerId: string | undefined;
}

export interface PlannersState extends PlannersProps {
  planners: PlannerData[];
  setPlanners: (planners: PlannerData[]) => boolean;

  setPlanner: (plannerId: string, planner: PlannerData) => boolean;
  addPlanner: (planner: PlannerData) => boolean;
  deletePlanner: (plannerId: string) => boolean;

  setActivePlannerId: (plannerId: string | undefined) => void;
}

export type PlannersStore = ReturnType<typeof createPlannersStore>;

const createPlannersStore = (initProps?: Partial<PlannersProps>) => {
  const DEFAULT_PROPS: PlannersProps = {
    planners: [],
    activePlannerId: undefined,
  };

  const activePlannerId = initProps?.planners?.[0]?.id;

  // Zustand store initialization debug log
  const debugPlannerIds = initProps?.planners?.map((p) => p.id).join(", ");
  console.debug(
    `Initializing planner store with active planner id ${activePlannerId} and planners ${debugPlannerIds}`,
  );

  return createStore<PlannersState>((set) => ({
    ...DEFAULT_PROPS, // Default props
    ...initProps, // Overwrite default props with initial props (if any)
    activePlannerId,

    /**
     * Replaces all planners in the store, then sets the active planner to the
     * first planner
     * @param planners an array of PlannerData objects
     * @returns true if the planners were updated, false otherwise
     */
    setPlanners: (planners: PlannerData[]) => {
      console.debug("planner store: Setting planners", planners);

      set({ planners, activePlannerId: planners[0]?.id });
      return true;
    },

    /**
     * Sets a planner in the store
     * @param plannerId a unique planner id
     * @param newPlanner a PlannerData object
     * @returns true if the planner was found and updated, false otherwise
     */
    setPlanner: (plannerId: string, newPlanner: PlannerData) => {
      console.debug("planner store: Setting planner", plannerId, newPlanner);

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
     * Adds a planner to the store then sets it as active
     * @param planner a PlannerData object
     * @returns true if the planner was added, false otherwise
     */
    addPlanner: (planner: PlannerData) => {
      console.debug("planner store: Adding planner", planner);

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
      console.debug("planner store: Deleting planner", plannerId);

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

    setActivePlannerId: (id: string | undefined) =>
      set({ activePlannerId: id }),
  }));
};

export default createPlannersStore;

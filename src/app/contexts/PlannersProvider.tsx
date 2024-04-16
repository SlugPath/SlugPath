import createPlannersStore, { PlannersStore } from "@/store/planners";
import { createContext, useState } from "react";

import { PlannerData } from "../types/Planner";

// A Context that provides the planners Zustand store to the app

// NOTE: Context is needed to provide initial data to the store from the server.

export const PlannersStoreContext = createContext<PlannersStore | null>(null);

export const PlannersStoreProvider = ({
  initialPlanners,
  children,
}: {
  initialPlanners?: PlannerData[];
  children: React.ReactNode;
}) => {
  // Note: useState used to insure initialization once per life-time
  // https://tkdodo.eu/blog/use-state-for-one-time-initializations
  const [store] = useState(() =>
    createPlannersStore({ planners: initialPlanners }),
  );

  return (
    <PlannersStoreContext.Provider value={store}>
      {children}
    </PlannersStoreContext.Provider>
  );
};

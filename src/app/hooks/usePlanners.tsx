import { PlannersState } from "@/store/planners";
import { useContext } from "react";
import { useStore } from "zustand";

import { PlannersStoreContext } from "../contexts/PlannersProvider";

function usePlannersStore<T>(selector: (state: PlannersState) => T): T {
  const store = useContext(PlannersStoreContext);
  if (!store) {
    throw new Error("usePlanners must be used within a PlannersStoreProvider");
  }

  return useStore(store, selector);
}

export default usePlannersStore;

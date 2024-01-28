import { DELETE_PLANNER } from "@/graphql/queries";
import { useMutation } from "@apollo/client";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { useLoadAllPlanners } from "./useLoad";

export function usePlanners(userId: string | undefined) {
  // Each planner has an immutable uuid associated with it
  // this will allow users to edit their planner names
  const [planners, setPlanners, activePlanner, setActivePlanner, { loading }] =
    useLoadAllPlanners(userId, handleLoadedPlanners);
  const [deletedPlanner, setDeletedPlanner] = useState(false);
  const [deletePlanner, { loading: loadingDeletePlanner }] = useMutation(
    DELETE_PLANNER,
    {
      onCompleted: () => {
        setDeletedPlanner(true);
      },
      onError: (err) => {
        console.error(err);
      },
    },
  );

  /**
   * @param numPlanners number of planners loaded.
   * If no planners are loaded, add a planner
   */
  function handleLoadedPlanners(numPlanners: number) {
    if (numPlanners === 0) {
      addPlanner();
    }
  }

  /**
   * `switchPlanner` switches between planners
   * @param id unique planner id
   */
  function switchPlanners(id: string) {
    setActivePlanner(id);
  }

  /**
   * `changePlannerName` handles the change event for a planner name
   * @param id unique planner id
   * @param newTitle new title of the planner
   */
  function changePlannerName(id: string, newTitle: string) {
    setPlanners((prev) => {
      return prev.map((p) => {
        return p.id === id ? { ...p, title: newTitle } : p;
      });
    });
  }

  /**
   * `addPlanner` creates a new planner with a default, editable name.
   */
  function addPlanner() {
    const id = uuidv4();
    setPlanners((prev) => {
      return [...prev, { id, title: "New Planner" }];
    });
    switchPlanners(id);
  }

  /**
   * `replaceCurrentPlanner` replaces the current planner with a new planner
   * if there are any other planners to replace it with. Otherwise, it adds
   * a new planner. This new planner will later be auto filled by the selected
   * default planner.
   */
  function replaceCurrentPlanner() {
    if (activePlanner === undefined) {
      return;
    }
    const title = planners.find((p) => p.id === activePlanner)?.title;
    const currentPlannerIndex = planners.findIndex(
      (p) => p.id === activePlanner,
    );

    // Get both halves of the array excluding the current planner
    const firstHalf = planners.slice(0, currentPlannerIndex);
    const secondHalf = planners.slice(currentPlannerIndex + 1);
    const numPlanners = Object.keys(planners).length;

    if (numPlanners > 0) {
      deletePlanner({
        variables: {
          userId,
          activePlanner,
        },
      });

      const newId = uuidv4();
      setPlanners([
        ...firstHalf,
        { id: newId, title: title ?? "New Planner" },
        ...secondHalf,
      ]);
      switchPlanners(newId);
    } else {
      addPlanner();
    }
  }

  /**
   * `removePlanner` removes a planner from the planner container
   * @param id unique planner id
   */
  const removePlanner = (id: string) => {
    const newPlanners = planners.filter((p) => p.id !== id);
    if (userId !== undefined) {
      deletePlanner({
        variables: {
          userId,
          plannerId: id,
        },
      });
    }
    setPlanners(newPlanners);

    // Switch to the next planner upon deletion if one exists
    const newActive = newPlanners[newPlanners.length - 1].id;

    if (newActive !== undefined) {
      switchPlanners(newActive);
    }
  };

  return {
    planners,
    switchPlanners,
    changePlannerName,
    addPlanner,
    removePlanner,
    replaceCurrentPlanner,
    activePlanner,
    plannersLoading: loading,
    loadingDeletePlanner,
    deletedPlanner,
  };
}

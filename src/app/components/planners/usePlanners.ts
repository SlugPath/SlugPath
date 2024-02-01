import { deletePlanner } from "@/app/actions/planner";
import { useLoadAllPlanners } from "@hooks/useLoad";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export function usePlanners(userId: string | undefined) {
  // Each planner has an immutable uuid associated with it
  // this will allow users to edit their planner names
  const [planners, setPlanners, activePlanner, setActivePlanner, { loading }] =
    useLoadAllPlanners(userId);
  const [deletedPlanner, setDeletedPlanner] = useState(false);
  const { mutate: deleteMutation, isPending: loadingDeletePlanner } =
    useMutation({
      mutationFn: async (input: { userId: string; plannerId: string }) => {
        await deletePlanner(input);
      },
      onSuccess: () => setDeletedPlanner(true),
      onError: (err) => {
        console.error(err);
      },
    });

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

    const newId = uuidv4();
    setPlanners([
      ...firstHalf,
      { id: newId, title: title ?? "New Planner" },
      ...secondHalf,
    ]);

    deleteMutation({
      userId: userId ?? "",
      plannerId: activePlanner,
    });

    switchPlanners(newId);
  }

  /**
   * `removePlanner` removes a planner from the planner container
   * @param id unique planner id
   */
  const removePlanner = (id: string) => {
    const newPlanners = planners.filter((p) => p.id !== id);
    if (userId !== undefined) {
      deleteMutation({
        userId,
        plannerId: id,
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

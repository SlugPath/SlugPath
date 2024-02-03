import { deletePlanner } from "@/app/actions/planner";
import { DefaultPlannerContext } from "@/app/contexts/DefaultPlannerProvider";
import { PlannerData } from "@/app/types/Planner";
import { cloneDefaultPlanner } from "@/lib/plannerUtils";
import { useMutation } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export function usePlanners(
  userId: string | undefined,
  allPlanners: PlannerData[],
) {
  // Each planner has an immutable uuid associated with it
  // this will allow users to edit their planner names
  const [planners, setPlanners] = useState(allPlanners);
  const [activePlanner, setActivePlanner] = useState<string | undefined>(
    planners[0]?.id,
  );
  const { defaultPlanner } = useContext(DefaultPlannerContext);

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

  function getPlanner(id: string) {
    const p = planners.find((p) => p.id === id);
    if (!p) throw new Error(`Planner not found with id '${id}'`);
    return p;
  }

  function setPlanner(id: string, title: string, courseState: PlannerData) {
    setPlanners((prev) => {
      const idx = prev.findIndex((p) => p.id === id);
      const before = prev.slice(0, idx);
      const after = prev.slice(idx + 1);
      return [...before, { ...courseState, id, title }, ...after];
    });
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
      return [
        ...prev,
        { ...cloneDefaultPlanner(defaultPlanner), id, title: "New Planner" },
      ];
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
    console.log(`In replaceCurrentPlanner activePlanner ${activePlanner}`);
    if (activePlanner === undefined) {
      return;
    }
    setPlanners((prev) => {
      const title = prev.find((p) => p.id === activePlanner)?.title ?? "";
      const idx = prev.findIndex((p) => p.id === activePlanner);
      const before = prev.slice(0, idx);
      const after = prev.slice(idx + 1);
      const res = [
        ...before,
        { ...cloneDefaultPlanner(defaultPlanner), id: activePlanner, title },
        ...after,
      ];
      console.log(`In replaceCurrentPlanner res ${JSON.stringify(res)}`);
      return res;
    });
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
    const newActive = newPlanners[newPlanners.length - 1]?.id;

    if (newActive !== undefined) {
      switchPlanners(newActive);
    }
  };

  return {
    planners,
    switchPlanners,
    changePlannerName,
    getPlanner,
    setPlanner,
    addPlanner,
    removePlanner,
    replaceCurrentPlanner,
    activePlanner,
    loadingDeletePlanner,
    deletedPlanner,
  };
}

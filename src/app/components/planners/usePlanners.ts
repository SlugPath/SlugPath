import { saveAllPlanners } from "@/app/actions/planner";
import { cloneDefaultPlanner, clonePlanner } from "@/lib/plannerUtils";
import { DefaultPlannerContext } from "@contexts/DefaultPlannerProvider";
import { PlannerData } from "@customTypes/Planner";
import useLocalStorage from "@hooks/useLocalStorage";
import { useMutation } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export function usePlanners(
  userId: string | undefined,
  allPlanners: PlannerData[],
) {
  // Each planner has an immutable uuid associated with it
  // this will allow users to edit their planner names
  const [planners, setPlanners] = useLocalStorage<PlannerData[]>(
    "planners",
    allPlanners,
  );
  const [activePlanner, setActivePlanner] = useLocalStorage<string | undefined>(
    "activePlanner",
    planners[0]?.id,
  );

  useEffect(() => {
    if (planners.length === 1) {
      setActivePlanner(planners[0].id);
    }
  }, [planners, setActivePlanner]);

  const { defaultPlanner } = useContext(DefaultPlannerContext);

  const [deletedPlanner, setDeletedPlanner] = useState(false);

  const [showExportModal, setShowExportModal] = useState(false);

  const [showShareModal, setShowShareModal] = useState(false);

  const { mutate: saveAll } = useMutation({
    mutationFn: async (input: { userId: string; planners: PlannerData[] }) => {
      await saveAllPlanners(input);
    },
    onError: (err) => {
      console.error(err);
    },
  });

  // Save changes to the planners every 30 seconds in the database
  useEffect(() => {
    const saveChanges = () => {
      if (userId) {
        saveAll({ userId, planners });
      }
    };
    const interval = setInterval(saveChanges, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [saveAll, userId, planners]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (userId) {
        navigator.sendBeacon("/api/planners", JSON.stringify(planners));
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [userId, planners, saveAll]);

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
      return res;
    });
  }

  /**
   * `removePlanner` removes a planner from the planner container
   * @param id unique planner id
   */
  const removePlanner = (id: string) => {
    const newPlanners = planners.filter((p) => p.id !== id);
    setDeletedPlanner(true);
    setPlanners(newPlanners);

    // Switch to the next planner upon deletion if one exists
    const newActive = newPlanners[newPlanners.length - 1]?.id;

    if (newActive !== undefined) {
      switchPlanners(newActive);
    }
  };

  /**
   * `duplicatePlanner` creates a new planner from the inputted planner id
   * @param id unique planner id
   */
  function duplicatePlanner(sourceID: string) {
    const sourcePlannerData = getPlanner(sourceID);
    const id = uuidv4();
    setPlanners((prev) => {
      return [
        ...prev,
        {
          ...clonePlanner(sourcePlannerData),
          id,
          title: `Copy of ${sourcePlannerData.title}`,
        },
      ];
    });
    switchPlanners(id);
  }

  return {
    planners,
    switchPlanners,
    changePlannerName,
    getPlanner,
    setPlanner,
    addPlanner,
    removePlanner,
    replaceCurrentPlanner,
    duplicatePlanner,
    activePlanner,
    deletedPlanner,
    showExportModal,
    showShareModal,
    setShowExportModal,
    setShowShareModal,
  };
}

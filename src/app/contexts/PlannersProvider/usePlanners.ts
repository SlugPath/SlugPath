import { cloneDefaultPlanner, clonePlanner } from "@/lib/plannerUtils";
import { saveAllPlanners } from "@actions/planner";
import { DefaultPlannerContext } from "@contexts/DefaultPlannerProvider";
import { PlannerData } from "@customTypes/Planner";
import useLocalStorage from "@hooks/useLocalStorage";
import { useMutation } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { MultiPlanner } from "./Types";

export function usePlanners(
  userId: string | undefined,
  allPlanners: PlannerData[],
) {
  const [{ planners, activePlanner }, setMultiPlanner] =
    useLocalStorage<MultiPlanner>("multiPlanner", {
      planners: allPlanners,
      activePlanner: allPlanners[0]?.id,
    });

  const switchPlanners = (id: string | undefined) => {
    setMultiPlanner((prev) => ({ ...prev, activePlanner: id }));
  };

  const { defaultPlanner } = useContext(DefaultPlannerContext);

  const [deletedPlanner, setDeletedPlanner] = useState(false);

  const [showExportModal, setShowExportModal] = useState(false);

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

  function getPlanner(id: string) {
    const p = planners.find((p) => p.id === id);
    if (!p) throw new Error(`Planner not found with id '${id}'`);
    return p;
  }

  function setPlanner(id: string, courseState: PlannerData) {
    setMultiPlanner((prev) => ({
      ...prev,
      planners: prev.planners.map((p) => (p.id === id ? courseState : p)),
    }));
  }

  /**
   * `changePlannerName` handles the change event for a planner name
   * @param id unique planner id
   * @param newTitle new title of the planner
   */
  function changePlannerName(id: string, newTitle: string) {
    setMultiPlanner((prev) => ({
      ...prev,
      planners: prev.planners.map((p) => {
        return p.id === id ? { ...p, title: newTitle } : p;
      }),
    }));
  }

  /**
   * `addPlanner` creates a new planner with a default, editable name.
   */
  function addPlanner() {
    const id = uuidv4();
    setMultiPlanner((prev) => ({
      planners: prev.planners.concat({
        ...cloneDefaultPlanner(defaultPlanner),
        id,
        title: "New Planner",
      }),
      activePlanner: id,
    }));
  }

  /**
   * `replaceCurrentPlanner` replaces the current planner with a new planner
   * if there are any other planners to replace it with. Otherwise, it adds
   * a new planner. This new planner will later be auto filled by the selected
   * default planner.
   */
  function replaceCurrentPlanner() {
    setMultiPlanner((prev) => {
      if (prev.activePlanner === undefined) {
        return prev;
      }
      const title =
        prev.planners.find((p) => p.id === prev.activePlanner)?.title ?? "";
      return {
        ...prev,
        planners: prev.planners.map((p) =>
          p.id === prev.activePlanner
            ? {
                ...cloneDefaultPlanner(defaultPlanner),
                id: prev.activePlanner,
                title,
              }
            : p,
        ),
      };
    });
  }

  /**
   * `removePlanner` removes a planner from the planner container
   * @param id unique planner id
   */
  const removePlanner = (id: string) => {
    const newPlanners = planners.filter((p) => p.id !== id);
    setMultiPlanner((prev) => ({
      ...prev,
      planners: prev.planners.filter((p) => p.id !== id),
      activePlanner: newPlanners[newPlanners.length - 1]?.id,
    }));
    setDeletedPlanner(true);
  };

  /**
   * `duplicatePlanner` creates a new planner from the inputted planner id
   * @param id unique planner id
   */
  function duplicatePlanner(sourceID: string) {
    const sourcePlannerData = getPlanner(sourceID);
    const id = uuidv4();
    setMultiPlanner((prev) => ({
      ...prev,
      activePlanner: id,
      planners: prev.planners.concat({
        ...clonePlanner(sourcePlannerData),
        id,
        title: `Copy of ${sourcePlannerData.title}`,
      }),
    }));
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
    setShowExportModal,
  };
}

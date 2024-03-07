import { cloneDefaultPlanner, clonePlanner } from "@/lib/plannerUtils";
import { getAllPlanners, saveAllPlanners } from "@actions/planner";
import { DefaultPlannerContext } from "@contexts/DefaultPlannerProvider";
import { PlannerData } from "@customTypes/Planner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { MultiPlanner } from "./Types";

export function usePlanners() {
  const { data: session } = useSession();
  const [{ planners, activePlanner }, setMultiPlanner] = useState<MultiPlanner>(
    {
      planners: [],
      activePlanner: undefined,
    },
  );
  const userId = session?.user.id;

  const { data } = useQuery({
    queryKey: ["planners"],
    queryFn: async () => {
      const userEmail = session?.user.email ?? "";
      if (userEmail.length == 0) return [];
      const planners = await getAllPlanners(userEmail);
      return planners;
    },
    refetchInterval: 1000 * 180,
    throwOnError: true,
  });

  // We have to use a useEffect here because we prefetch the data on the server using react-query
  // so we have to set the data result to multiplanner manually
  useEffect(() => {
    if (data && data.length > 0) {
      setMultiPlanner({
        planners: data,
        activePlanner: data[0].id,
      });
    }
  }, [data, setMultiPlanner]);

  const switchPlanners = (id: string | undefined) => {
    setMultiPlanner((prev) => ({ ...prev, activePlanner: id }));
  };

  const { userDefaultPlanner } = useContext(DefaultPlannerContext);
  const [showExportModal, setShowExportModal] = useState(false);

  // Manage window focus
  const [isWindowFocused, setIsWindowFocused] = useState(true);
  useEffect(() => {
    const handleFocus = () => {
      setIsWindowFocused(true);
    };

    const handleBlur = () => {
      setIsWindowFocused(false);
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  const { mutate: saveAll } = useMutation({
    mutationKey: ["savePlanners"],
    mutationFn: async (input: { userId: string; planners: PlannerData[] }) => {
      await saveAllPlanners(input);
    },
    onError: (err) => {
      console.error(err);
    },
  });

  // Save changes to the planners every 30 seconds in the database if the tab is currently focused
  useEffect(() => {
    const saveChanges = () => {
      if (userId && isWindowFocused) {
        saveAll({ userId, planners });
      }
    };
    const interval = setInterval(saveChanges, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [saveAll, userId, planners, isWindowFocused]);

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
        ...cloneDefaultPlanner(userDefaultPlanner),
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
                ...cloneDefaultPlanner(userDefaultPlanner),
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
    setMultiPlanner((prev) => {
      const idx = prev.planners.findIndex((p) => p.id === id);
      const newPlanners = prev.planners.filter((p) => p.id !== id);
      const newActivePlanner = newPlanners[idx]?.id ?? newPlanners[idx - 1]?.id;
      return {
        planners: newPlanners,
        activePlanner: newActivePlanner,
      };
    });
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
    showExportModal,
    setShowExportModal,
  };
}

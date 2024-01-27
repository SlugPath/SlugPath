import { v4 as uuidv4 } from "uuid";
import { useLoadAllPlanners } from "./useLoad";
import { useMutation } from "@apollo/client";
import { useState } from "react";
import { DELETE_PLANNER } from "@/graphql/queries";

export function usePlanners(userId: string | undefined) {
  // Each planner has an immutable uuid associated with it
  // this will allow users to edit their planner names
  const [planners, setPlanners, { loading }] = useLoadAllPlanners(
    userId,
    handleLoadedPlanners,
  );
  const [deletedPlanner, setDeletedPlanner] = useState<boolean>(false);
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
   * @param title planner title
   */
  const switchPlanners = (id: string, title: string) => {
    setPlanners((prev) =>
      (() => {
        // Get id of previously active title if there was one
        // and deactivate it
        const prevId = Object.keys(prev).find((uid: string) => prev[uid][1]);
        if (prevId === undefined) {
          return { ...prev, [id]: [title, true] };
        }
        const prevTitle = prev[prevId][0];

        return {
          ...prev,
          [prevId]: [prevTitle, false],
          [id]: [title, true],
        };
      })(),
    );
  };

  /**
   * `changePlannerName` handles the change event for a planner name
   * @param event keyboard event
   * @param id unique planner id
   */
  const changePlannerName = (newName: string, id: string) => {
    setPlanners({
      ...planners,
      [id]: [newName, planners[id][1]],
    });
  };

  /**
   * `addPlanner` creates a new planner with a default, editable name.
   * It returns early if the user has too many planners already
   */
  function addPlanner() {
    const [id, title] = [uuidv4(), `New Planner`];
    setPlanners({
      ...planners,
      [id]: [title, false],
    });
    switchPlanners(id, title);
  }

  /**
   * `replaceCurrentPlanner` replaces the current planner with a new planner
   * if there are any other planners to replace it with. Otherwise, it adds
   * a new planner. This new planner will later be auto filled by the selected
   * default planner.
   */
  function replaceCurrentPlanner() {
    const currentPlannerId = Object.keys(planners).find(
      (plannerId) => planners[plannerId][1],
    );
    if (currentPlannerId === undefined) {
      return;
    }

    const numPlanners = Object.keys(planners).length;
    const currentPlannerIndex = Object.keys(planners).findIndex(
      (plannerId) => plannerId === currentPlannerId,
    );
    const title = planners[currentPlannerId][0];

    const plannersAsArray = Object.entries(planners);
    const firstHalf = Object.fromEntries(
      plannersAsArray.slice(0, currentPlannerIndex),
    );
    const secondHalf = Object.fromEntries(
      plannersAsArray.slice(currentPlannerIndex + 1),
    );

    if (numPlanners > 0) {
      deletePlanner({
        variables: {
          userId,
          plannerId: Object.keys(planners)[0],
        },
      });

      const newId = uuidv4();
      setPlanners({
        ...firstHalf,
        [newId]: [title, false],
        ...secondHalf,
      });
      switchPlanners(newId, title);
    } else {
      addPlanner();
    }
  }

  /**
   * `removePlanner` removes a planner from the planner container
   * @param id unique planner id
   */
  const removePlanner = (id: string) => {
    const newPlanners = { ...planners };
    delete newPlanners[id];
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
    const newActive =
      Object.keys(newPlanners)[Object.keys(newPlanners).length - 1];

    if (newActive !== undefined) {
      const title = newPlanners[newActive][0];
      switchPlanners(newActive, title);
    }
  };

  const getActivePlanner = () => {
    const activePlanner = Object.keys(planners).find(
      (id: string) => planners[id][1],
    );
    if (activePlanner === undefined) {
      return undefined;
    }
    return { id: activePlanner, title: planners[activePlanner][0] };
  };

  return {
    planners,
    switchPlanners,
    changePlannerName,
    addPlanner,
    removePlanner,
    replaceCurrentPlanner,
    activePlanner: getActivePlanner(),
    plannersLoading: loading,
    loadingDeletePlanner,
    deletedPlanner,
  };
}

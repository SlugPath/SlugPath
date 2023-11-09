import { MultiPlanner } from "../ts-types/MultiPlanner";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useLoadAllPlanners } from "./useLoad";

export function usePlanner(userId: string | undefined) {
  const [counter, setCounter] = useState(1);

  // Each planner has an immutable uuid associated with it
  // this will allow users to edit their planner names
  const [planners, setPlanners] = useLoadAllPlanners(userId);

  /**
   * Handles update to multiple planners by updating cookies and state
   * @param plannerState new state of the multi planner
   */
  const handlePlannerUpdate = (plannerState: MultiPlanner) => {
    setPlanners(plannerState);
  };

  /**
   * `switchPlanner` switches between planners
   * @param id unique planner id
   * @param title planner title
   */
  const handleSwitchPlanners = (id: string, title: string) => {
    handlePlannerUpdate(
      (() => {
        // Get id of previously active title if there was one
        // and deactivate it
        const prevId = Object.keys(planners).find(
          (uid: string) => planners[uid][1],
        );
        if (prevId === undefined) {
          return { ...planners, [id]: [title, true] };
        }
        const prevTitle = planners[prevId][0];

        return {
          ...planners,
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
  const handleChangePlannerName = (
    event: React.ChangeEvent<HTMLInputElement>,
    id: string,
  ) => {
    handlePlannerUpdate({
      ...planners,
      [id]: [event.target.value, planners[id][1]],
    });
  };

  /**
   * `addPlanner` creates a new planner with a default, editable name.
   * It returns early if the user has too many planners already
   */
  const handleAddPlanner = () => {
    setCounter((prev) => prev + 1);
    const [id, title] = [uuidv4(), `Planner ${counter + 1}`];
    handlePlannerUpdate({
      ...planners,
      [id]: [title, false],
    });
    handleSwitchPlanners(id, title);
  };

  /**
   * `removePlanner` removes a planner from the planner container
   * @param id unique planner id
   */
  const handleRemovePlanner = (id: string) => {
    const newPlanners = { ...planners };
    delete newPlanners[id];
    handlePlannerUpdate(newPlanners);
  };

  return {
    planners,
    handleSwitchPlanners,
    handleChangePlannerName,
    handleAddPlanner,
    handleRemovePlanner,
  };
}

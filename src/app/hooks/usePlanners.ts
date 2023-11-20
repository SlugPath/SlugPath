import { v4 as uuidv4 } from "uuid";
import { useLoadAllPlanners } from "./useLoad";
import { gql, useMutation } from "@apollo/client";

const DELETE_PLANNER = gql`
  mutation DeletePlanner($userId: String!, $plannerId: String!) {
    deletePlanner(userId: $userId, plannerId: $plannerId) {
      plannerId
    }
  }
`;

export function usePlanners(userId: string | undefined) {
  // Each planner has an immutable uuid associated with it
  // this will allow users to edit their planner names
  const [planners, setPlanners] = useLoadAllPlanners(userId);

  const [mutation] = useMutation(DELETE_PLANNER);

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
  const changePlannerName = (
    event: React.ChangeEvent<HTMLInputElement>,
    id: string,
  ) => {
    setPlanners({
      ...planners,
      [id]: [event.target.value, planners[id][1]],
    });
  };

  /**
   * `addPlanner` creates a new planner with a default, editable name.
   * It returns early if the user has too many planners already
   */
  const addPlanner = () => {
    const [id, title] = [uuidv4(), `New Planner`];
    setPlanners({
      ...planners,
      [id]: [title, false],
    });
    switchPlanners(id, title);
  };

  /**
   * `removePlanner` removes a planner from the planner container
   * @param id unique planner id
   */
  const removePlanner = (id: string) => {
    const newPlanners = { ...planners };
    delete newPlanners[id];
    if (userId !== undefined) {
      mutation({
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
    activePlanner: getActivePlanner(),
  };
}

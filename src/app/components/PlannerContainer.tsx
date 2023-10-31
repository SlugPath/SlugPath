import { useEffect, useState } from "react";
import { getCookie, setCookie, deleteCookie } from "cookies-next";
import { v4 as uuidv4 } from "uuid";
import { List, ListItem } from "@mui/joy";
import CoursePlanner from "./CoursePlanner";
import { MultiPlanner } from "../ts-types/MultiPlanner";
import TabList from "./TabList";

export default function PlannerContainer() {
  // Each planner has an immutable uuid associated with it
  // this will allow users to edit their planner names
  const [planners, setPlanners] = useState<MultiPlanner>({
    [uuidv4()]: ["Planner 1", true],
  });

  // Retrieves the multiplanner from cookies if it exists
  useEffect(() => {
    const cookiePlannerState = getCookie("plannerState");
    if (cookiePlannerState) {
      const cookiePlanners = JSON.parse(cookiePlannerState) as MultiPlanner;
      setPlanners(cookiePlanners);
    }
  }, []);

  /**
   * Handles update to multiple planners by updating cookies and state
   * @param plannerState new state of the multi planner
   */
  const handlePlannerUpdate = (plannerState: MultiPlanner) => {
    setPlanners(plannerState);
    setCookie("plannerState", JSON.stringify(plannerState));
  };

  /**
   * `switchPlanner` switches between planners
   * @param id unique planner id
   * @param title planner title
   */
  const switchPlanners = (id: string, title: string) => {
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
   * Handles the change event for a planner name
   * @param event keyboard event
   * @param id unique planner id
   */
  const changePlannerName = (
    event: React.ChangeEvent<HTMLInputElement>,
    id: string,
  ) => {
    handlePlannerUpdate({
      ...planners,
      [id]: [event.target.value, planners[id][1]],
    });
  };

  /**
   * Creates a new planner with the provided title
   */
  const addPlanner = (title: string) => {
    const id = uuidv4();
    handlePlannerUpdate({
      ...planners,
      [id]: [title, false],
    });
    switchPlanners(id, title);
  };

  /**
   * Removes a planner from the planner container
   * @param id unique planner id
   */
  const removePlanner = (id: string) => {
    const newPlanners = { ...planners };
    delete newPlanners[id];
    deleteCookie("courseState" + id);
    handlePlannerUpdate(newPlanners);
  };

  return (
    <div>
      {/* Tabs Begin */}
      <TabList
        planners={planners}
        removePlanner={removePlanner}
        addPlanner={addPlanner}
        switchPlanners={switchPlanners}
        changePlannerName={changePlannerName}
      />
      {/* Tabs End */}
      {/* Planner Begins */}
      <List>
        {Object.entries(planners).map(([id, [, isActive]]) => (
          <ListItem sx={{ display: isActive ? "block" : "none" }} key={id}>
            <CoursePlanner id={id} isActive={isActive} />
          </ListItem>
        ))}
      </List>
      {/* Planner Ends*/}
    </div>
  );
}

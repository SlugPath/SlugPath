import { useEffect, useState } from "react";
import { getCookie, setCookie, deleteCookie } from "cookies-next";
import { v4 as uuidv4 } from "uuid";
import { IconButton, Input, List, ListItem, ListItemButton } from "@mui/joy";
import CoursePlanner from "./CoursePlanner";
import { Add, Delete } from "@mui/icons-material";
import { MultiPlanner } from "../ts-types/MultiPlanner";

export default function PlannerContainer() {
  const [counter, setCounter] = useState(1);
  const [isEditing, setIsEditing] = useState<string | null>(null);

  // Each planner has an immutable uuid associated with it
  // this will allow users to edit their planner names
  const [planners, setPlanners] = useState<MultiPlanner>({
    [uuidv4()]: ["Planner 1", true],
  });

  const MAX_PLANNERS = 10;

  // Retrieves the multiplanner from cookies if it exists
  useEffect(() => {
    const cookiePlannerState = getCookie("plannerState");
    if (cookiePlannerState) {
      const cookiePlanners = JSON.parse(cookiePlannerState) as MultiPlanner;
      setPlanners(cookiePlanners);
    }
  });

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
   * `handleDoubleClick` handles the double click mouse event.
   * Used for editing planner names
   * @param id unique planner id
   */
  const handleDoubleClick = (id: string) => {
    setIsEditing(id);
  };

  /**
   * `handleBlur` handles the blur event after a user is done
   * editing a planner name.
   */
  const handleBlur = () => {
    setIsEditing(null);
  };

  /**
   * `handleChange` handles the change event for a planner name
   * @param event keyboard event
   * @param id unique planner id
   */
  const handleChange = (
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
  const addPlanner = () => {
    const keys = Object.keys(planners);
    if (keys.length == MAX_PLANNERS) {
      alert("You have too many planners open, delete one to make a new one");
      return;
    }
    setCounter((prev) => prev + 1);
    const [id, title] = [uuidv4(), `Planner ${counter}`];
    handlePlannerUpdate({
      ...planners,
      [id]: [`Planner ${counter + 1}`, false],
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
    deleteCookie("courseState" + id);
    handlePlannerUpdate(newPlanners);
  };

  return (
    <div>
      {/* Tabs Begin */}
      <List orientation="horizontal" size="lg">
        {Object.entries(planners).map(([id, [title, isActive]]) => (
          <ListItem
            onDoubleClick={() => handleDoubleClick(id)}
            key={id}
            endAction={
              <IconButton
                onClick={() => removePlanner(id)}
                aria-label="Delete"
                size="lg"
                color="danger"
              >
                <Delete />
              </IconButton>
            }
          >
            <ListItemButton
              onClick={() => switchPlanners(id, title)}
              variant="outlined"
              color={isActive ? "primary" : "neutral"}
              selected={isActive}
            >
              {/* Editable planner titles */}
              {isEditing === id ? (
                <Input
                  variant="soft"
                  value={title}
                  autoFocus
                  size="md"
                  sx={{
                    "--Input-focusedInset": "var(--any, )",
                    "--Input-focusedThickness": "0.25rem",
                    "--Input-focusedHighlight": "rgba(13,110,253,.25)",
                    "&::before": {
                      transition: "box-shadow .15s ease-in-out",
                    },
                    "&:focus-within": {
                      borderColor: "#86b7fe",
                    },
                    maxWidth: "15ch",
                  }}
                  onChange={(e) => handleChange(e, id)}
                  onBlur={handleBlur}
                />
              ) : (
                <span>{title}</span>
              )}
            </ListItemButton>
          </ListItem>
        ))}

        {/* Add Tab Button */}
        <ListItem
          startAction={
            <IconButton
              onClick={() => addPlanner()}
              aria-label="Add"
              size="lg"
              variant="plain"
              color="primary"
            >
              <Add />
            </IconButton>
          }
        />
      </List>
      {/* Tabs Ends */}

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

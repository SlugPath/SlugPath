import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { IconButton, Input, List, ListItem, ListItemButton } from "@mui/joy";
import CoursePlanner from "./CoursePlanner";
import { Add, Delete } from "@mui/icons-material";

export default function PlannerContainer() {
  const [counter, setCounter] = useState(1);
  const [isEditing, setIsEditing] = useState<string | null>(null);

  // Each planner has an immutable uuid associated with it
  // this will allow users to edit their planner names
  const [planners, setPlanners] = useState<{
    [key: string]: [string, boolean];
  }>({
    [uuidv4()]: ["Planner 1", true],
  });

  const MAX_PLANNERS = 10;

  /**
   * `switchPlanner` switches between planners
   * @param id unique planner id
   * @param title planner title
   */
  const switchPlanners = (id: string, title: string) => {
    setPlanners((prev) => {
      // Get id of previously active title if there was one
      // and deactivate it
      const prevId = Object.keys(prev).find((uid: string) => prev[uid][1]);
      if (prevId === undefined) {
        return { ...prev, [id]: [title, true] };
      }
      const prevTitle = prev[prevId][0];

      return { ...prev, [prevId]: [prevTitle, false], [id]: [title, true] };
    });
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
    setPlanners((prev) => {
      return { ...prev, [id]: [event.target.value, prev[id][1]] };
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
    setPlanners({ ...planners, [uuidv4()]: [`Planner ${counter + 1}`, false] });
  };

  /**
   * `removePlanner` removes a planner from the planner container
   * @param id unique planner id
   */
  const removePlanner = (id: string) => {
    setPlanners((prev) => {
      const newPlanners = { ...prev };
      delete newPlanners[id];
      return newPlanners;
    });
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
                    width: `${Math.max(5, title.length + 1)}ch`,
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
        {Object.entries(planners).map(([id, [title, isActive]]) => (
          <ListItem sx={{ display: isActive ? "block" : "none" }} key={id}>
            <CoursePlanner title={title} isActive={isActive} />
          </ListItem>
        ))}
      </List>
      {/* Planner Ends*/}
    </div>
  );
}

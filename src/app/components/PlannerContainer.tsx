import { useState } from "react";
import { IconButton, List, ListItem, ListItemButton } from "@mui/joy";
import CoursePlanner from "./CoursePlanner";
import { Add, Delete } from "@mui/icons-material";

export default function PlannerContainer() {
  const [counter, setCounter] = useState(1);
  const [planners, setPlanners] = useState<{
    [key: string]: boolean;
  }>({
    "Planner 1": true,
  });

  const MAX_PLANNERS = 10;

  const switchPlanners = (title: string) => {
    setPlanners((prev) => {
      const currActive = Object.keys(prev).find(
        (prevTitle: string) => prev[prevTitle],
      );
      if (currActive === undefined) {
        return { ...prev, [title]: true };
      }
      return { ...prev, [currActive]: false, [title]: true };
    });
  };

  const addPlanner = () => {
    const keys = Object.keys(planners);
    if (keys.length == MAX_PLANNERS) {
      alert("You have too many planners open, delete one to make a new one");
      return;
    }
    setCounter((prev) => prev + 1);
    setPlanners({ ...planners, [`Planner ${counter}`]: false });
  };

  const removePlanner = (title: string) => {
    setPlanners((prev) => {
      const newPlanners = { ...prev };
      delete newPlanners[title];
      return newPlanners;
    });
  };

  return (
    <div>
      {/* Tabs Begins */}
      <List orientation="horizontal" size="lg">
        {Object.entries(planners).map(([title, isActive], idx) => (
          <ListItem
            key={idx}
            endAction={
              <IconButton
                onClick={() => removePlanner(title)}
                aria-label="Delete"
                size="lg"
                color="danger"
              >
                <Delete />
              </IconButton>
            }
          >
            <ListItemButton
              onClick={() => switchPlanners(title)}
              variant="outlined"
              color={isActive ? "primary" : "neutral"}
              selected={isActive}
            >
              <p>{title}</p>
            </ListItemButton>
          </ListItem>
        ))}
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
        {Object.entries(planners).map(([title, isActive]) => (
          <ListItem sx={{ display: isActive ? "block" : "none" }} key={title}>
            <CoursePlanner title={title} isActive={isActive} />
          </ListItem>
        ))}
      </List>
      {/* Planner Ends*/}
    </div>
  );
}

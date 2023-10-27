import { useState } from "react";
import { IconButton, List, ListItem, ListItemButton } from "@mui/joy";
import CoursePlanner from "./CoursePlanner";
import { Add, Delete } from "@mui/icons-material";

export default function PlannerContainer() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [plannerTitles, setPlannerTitles] = useState<string[]>(["Planner 1"]);

  const MAX_PLANNERS = 10;

  const switchPlanners = (idx: number) => {
    setActiveIdx(idx);
  };

  const addPlanner = () => {
    if (plannerTitles.length == MAX_PLANNERS) {
      alert("You have too many planners open, delete one to make a new one");
      return;
    }
    setPlannerTitles([...plannerTitles, `Planner ${plannerTitles.length + 1}`]);
    setActiveIdx(plannerTitles.length);
  };

  const removePlanner = (idx: number) => {
    if (idx != -1)
      setPlannerTitles([
        ...plannerTitles.slice(0, idx),
        ...plannerTitles.slice(idx + 1),
      ]);
  };

  const setVisibility = (idx: number) => {
    return idx != activeIdx ? { display: "none" } : { display: "block" };
  };

  return (
    <div>
      {/* Tabs at the top */}
      <List orientation="horizontal" size="lg">
        {plannerTitles.map((title, idx) => (
          <ListItem
            key={idx}
            endAction={
              <IconButton
                onClick={() => removePlanner(idx)}
                aria-label="Delete"
                size="lg"
                color="danger"
              >
                <Delete />
              </IconButton>
            }
          >
            <ListItemButton
              onClick={() => switchPlanners(idx)}
              variant="outlined"
              color={idx == activeIdx ? "primary" : "neutral"}
              selected={idx == activeIdx}
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
      {/* Planners */}
      <List>
        {plannerTitles.map((title, idx) => (
          <ListItem
            sx={setVisibility(idx)}
            /*className={idx != activeIdx ? "hidden" : "block"} */ key={idx}
          >
            <CoursePlanner title={title} isActive={idx == activeIdx} />
          </ListItem>
        ))}
      </List>
    </div>
  );
}

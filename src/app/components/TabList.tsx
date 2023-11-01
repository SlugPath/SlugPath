import { List, ListItem, ListItemButton, IconButton, Input } from "@mui/joy";
import { Add, DeleteForever } from "@mui/icons-material";
import { MultiPlanner } from "../ts-types/MultiPlanner";
import { useState } from "react";
import PlannerDeleteAlert, { OpenState } from "./PlannerDeleteAlert";
import TooManyPlannersAlert from "./TooManyPlannersAlert";

export interface TabListProps {
  planners: MultiPlanner;
  removePlanner: (id: string) => void;
  addPlanner: () => void;
  switchPlanners: (id: string, title: string) => void;
  changePlannerName: (
    event: React.ChangeEvent<HTMLInputElement>,
    id: string,
  ) => void;
}

export default function TabList(props: TabListProps) {
  const {
    planners,
    removePlanner,
    switchPlanners,
    changePlannerName,
    addPlanner,
  } = props;

  // State-ful variables for managing the editing of planner names
  // and deletion alerts
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [openAlert, setAlert] = useState<OpenState>(["", ""]);
  const [openTooMany, setTooMany] = useState(false);

  const MAX_PLANNERS = 10;

  /**
   * Event listener that runs when user clicks the add button
   */
  const handleAdd = () => {
    // Check if user has too many planners open
    if (Object.keys(planners).length == MAX_PLANNERS) {
      setTooMany(true);
      return;
    }
    addPlanner();
  };

  /**
   * Callback to delete planner and close the alert modal
   * @param id planner id
   */
  const deletePlanner = (id: string) => {
    setAlert(["", ""]);
    removePlanner(id);
  };

  return (
    <List orientation="horizontal" size="lg">
      {/* Start alerts */}
      <PlannerDeleteAlert
        open={openAlert}
        onClose={() => setAlert(["", ""])}
        onDelete={deletePlanner}
      />
      <TooManyPlannersAlert
        open={openTooMany}
        onClose={() => setTooMany(false)}
      />
      {/* End alerts */}
      {Object.entries(planners).map(([id, [title, isActive]]) => (
        <ListItem
          onDoubleClick={() => setIsEditing(id)}
          key={id}
          endAction={
            <IconButton
              onClick={() => setAlert([id, title])}
              aria-label="Delete"
              size="lg"
              color="danger"
            >
              <DeleteForever />
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
                onChange={(e) => changePlannerName(e, id)}
                onBlur={() => setIsEditing(null)}
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
            onClick={() => handleAdd()}
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
  );
}

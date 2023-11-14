import { List, ListItem, ListItemButton, IconButton, Input } from "@mui/joy";
import { Add, DeleteForever } from "@mui/icons-material";
import { MultiPlanner } from "../ts-types/MultiPlanner";
import { useState } from "react";
import PlannerDeleteAlert, { OpenState } from "./PlannerDeleteAlert";
import TooManyPlannersAlert from "./TooManyPlannersAlert";

const MAX_PLANNERS = 10;

export interface TabListProps {
  planners: MultiPlanner;
  onRemovePlanner: (id: string) => void;
  onAddPlanner: () => void;
  onSwitchPlanners: (id: string, title: string) => void;
  onChangePlannerName: (
    event: React.ChangeEvent<HTMLInputElement>,
    id: string,
  ) => void;
}

export default function TabList(props: TabListProps) {
  const {
    planners,
    onRemovePlanner,
    onSwitchPlanners,
    onChangePlannerName,
    onAddPlanner,
  } = props;

  // State-ful variables for managing the editing of planner names
  // and deletion alerts
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [openAlert, setAlert] = useState<OpenState>(["", ""]);
  const [openTooMany, setTooMany] = useState(false);

  /**
   * Event listener that runs when user clicks the add button
   */
  const handleAddPlanner = () => {
    // Check if user has too many planners open
    if (Object.keys(planners).length == MAX_PLANNERS) {
      setTooMany(true);
      return;
    }
    onAddPlanner();
  };

  /**
   * Callback to delete planner and close the alert modal
   * @param id planner id
   */
  const deletePlanner = (id: string) => {
    setAlert(["", ""]);
    onRemovePlanner(id);
  };

  return (
    <List orientation="horizontal" size="sm">
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
              size="sm"
              color="danger"
            >
              <DeleteForever />
            </IconButton>
          }
        >
          <ListItemButton
            onClick={() => onSwitchPlanners(id, title)}
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
                onChange={(e) => onChangePlannerName(e, id)}
                onBlur={() => setIsEditing(null)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setIsEditing(null);
                  }
                }}
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
            onClick={() => handleAddPlanner()}
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

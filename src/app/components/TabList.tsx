import { List, ListItem, ListItemButton, IconButton, Input } from "@mui/joy";
import { Add, DeleteForever } from "@mui/icons-material";
import { MultiPlanner } from "../ts-types/MultiPlanner";
import { useState } from "react";
import PlannerDeleteAlert, { OpenState } from "./PlannerDeleteAlert";
import PlannerAddModal from "./PlannerAddModal";

export interface TabListProps {
  planners: MultiPlanner;
  removePlanner: (id: string) => void;
  addPlanner: (title: string) => void;
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
  const [openAdd, setAdd] = useState(false);

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
      {Object.entries(planners).map(([id, [title, isActive]]) => (
        <>
          <PlannerDeleteAlert
            key={id}
            open={openAlert}
            onClose={() => setAlert(["", ""])}
            onDelete={deletePlanner}
          />
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
        </>
      ))}

      {/* Add Tab Button */}
      <ListItem
        startAction={
          <IconButton
            onClick={() => setAdd(true)}
            aria-label="Add"
            size="lg"
            variant="plain"
            color="primary"
          >
            <Add />
          </IconButton>
        }
      />
      <PlannerAddModal
        open={openAdd}
        onClose={() => setAdd(false)}
        onSubmit={(title) => addPlanner(title)}
      />
    </List>
  );
}

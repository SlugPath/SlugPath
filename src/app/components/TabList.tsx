import { List, ListItem, ListItemButton, IconButton, Input } from "@mui/joy";
import { Add } from "@mui/icons-material";
import { useContext, useState } from "react";
import PlannerDeleteAlert, { OpenState } from "./PlannerDeleteAlert";
import TooManyPlannersAlert from "./TooManyPlannersAlert";
import { PlannersContext } from "../contexts/PlannersProvider";

const MAX_PLANNERS = 8;

export default function TabList() {
  const {
    planners,
    removePlanner,
    switchPlanners,
    changePlannerName,
    addPlanner,
  } = useContext(PlannersContext);

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
            <button
              onClick={() => setAlert([id, title])}
              aria-label="Delete"
              color="danger"
              className="hover:bg-red-100 p-1 rounded-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="red"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </button>
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

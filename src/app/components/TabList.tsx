import { List, ListItem, ListItemButton, IconButton, Input } from "@mui/joy";
import { Delete, Add } from "@mui/icons-material";
import { MultiPlanner } from "../ts-types/MultiPlanner";
import { useState } from "react";

export default function TabList({
  planners,
  removePlanner,
  addPlanner,
  switchPlanners,
  changePlannerName,
}: {
  planners: MultiPlanner;
  removePlanner: (id: string) => void;
  addPlanner: () => void;
  switchPlanners: (id: string, title: string) => void;
  changePlannerName: (
    event: React.ChangeEvent<HTMLInputElement>,
    id: string,
  ) => void;
}) {
  const [isEditing, setIsEditing] = useState<string | null>(null);

  return (
    <List orientation="horizontal" size="lg">
      {Object.entries(planners).map(([id, [title, isActive]]) => (
        <ListItem
          onDoubleClick={() => setIsEditing(id)}
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
  );
}

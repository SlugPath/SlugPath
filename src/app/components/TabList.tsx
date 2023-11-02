import { List, ListItem, ListItemButton, IconButton, Input } from "@mui/joy";
import { Delete, Add } from "@mui/icons-material";
import { MultiPlanner } from "../ts-types/MultiPlanner";
import { useState } from "react";

export default function TabList({
  planners,
  onRemovePlanner,
  onAddPlanner,
  onSwitchPlanners,
  onChangePlannerName,
}: {
  planners: MultiPlanner;
  onRemovePlanner: (id: string) => void;
  onAddPlanner: () => void;
  onSwitchPlanners: (id: string, title: string) => void;
  onChangePlannerName: (
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
              onClick={() => onRemovePlanner(id)}
              aria-label="Delete"
              size="lg"
              color="danger"
            >
              <Delete />
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
            onClick={() => onAddPlanner()}
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

import { geLabels } from "@/lib/plannerUtils";
import { Label } from "@customTypes/Label";
import { Add } from "@mui/icons-material";
import { List, ListItem, Typography } from "@mui/joy";
import { IconButton } from "@mui/joy";

import CourseLabel from "../../planner/quarters/courses/CourseLabel";

export default function SelectedLabels({
  labels,
  handleOpenLabels,
  ge,
}: {
  labels: Label[];
  handleOpenLabels: () => void;
  ge: string[];
}) {
  const allLabels = [...geLabels(ge), ...labels];

  return (
    <div className="flex flex-row items-center justify-start">
      <Typography>Labels:</Typography>
      <div className="overflow-x-auto flex no-scrollbar">
        <List orientation="horizontal">
          {allLabels.map((label) => (
            <ListItem key={label.id} style={{ padding: "0.1rem" }}>
              <CourseLabel
                label={label}
                displayText={label.name.length > 0}
                inMenu
              />
            </ListItem>
          ))}
        </List>
      </div>
      <IconButton onClick={handleOpenLabels}>
        <Add />
      </IconButton>
    </div>
  );
}

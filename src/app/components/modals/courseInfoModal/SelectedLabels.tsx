import { List, ListItem, Typography } from "@mui/joy";
import { Add } from "@mui/icons-material";
import { IconButton } from "@mui/joy";
import { Label } from "../../../types/Label";
import CourseLabel from "../../planner/quarters/courses/CourseLabel";
import { geLabels } from "@/lib/plannerUtils";

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
      <List orientation="horizontal">
        {allLabels.map((label) => (
          <ListItem key={label.id}>
            <CourseLabel
              label={label}
              displayText={label.name.length > 0}
              inMenu
            />
          </ListItem>
        ))}
        <IconButton onClick={handleOpenLabels}>
          <Add />
        </IconButton>
      </List>
    </div>
  );
}

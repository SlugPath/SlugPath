import { List, ListItem, Typography } from "@mui/joy";
import { Add } from "@mui/icons-material";
import { IconButton } from "@mui/joy";
import { Label } from "../../types/Label";
import CourseLabel from "../CourseLabel";

export default function SelectedLabels({
  labels,
  handleOpenLabels,
}: {
  labels: Label[];
  handleOpenLabels: () => void;
}) {
  return (
    // align items left
    <div className="flex flex-row items-center justify-start">
      <Typography>Labels:</Typography>
      <List orientation="horizontal">
        {labels.map((label) => (
          <ListItem key={label.id}>
            <CourseLabel
              label={label}
              displayText={label.name.length > 0}
              inMenu
            />
          </ListItem>
        ))}
        <IconButton onClick={handleOpenLabels} variant="solid">
          <Add />
        </IconButton>
      </List>
    </div>
  );
}

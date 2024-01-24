import { isCustomCourse } from "@/lib/plannerUtils";
import { Grid, IconButton, Input, Typography } from "@mui/joy";
import { ChangeEvent } from "react";
import { Edit } from "@mui/icons-material";
import { StoredCourse } from "../../types/Course";

export default function CourseDescription({
  course,
  description,
  editing,
  setEditing,
  customDescription,
  handleDescriptionChange,
  handleEndEditing,
  term,
}: {
  course: StoredCourse;
  description: string;
  editing: boolean;
  setEditing: (editing: boolean) => void;
  customDescription: string;
  handleDescriptionChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleEndEditing: () => void;
  term?: string;
}) {
  return (
    <Typography component="p" id="modal-description" textColor="inherit" mb={1}>
      <Grid container alignItems="center" spacing="1">
        <Grid>
          {editing ? (
            <>
              <Typography component="p">Description:</Typography>
              <Input
                variant="soft"
                autoFocus
                value={customDescription}
                size="md"
                placeholder={course.description}
                onChange={handleDescriptionChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleEndEditing();
                }}
                onBlur={handleEndEditing}
              />
            </>
          ) : (
            description
          )}
        </Grid>
        <Grid>
          {isCustomCourse(course) && term !== undefined && (
            <IconButton
              size="sm"
              onClick={() => {
                if (editing) {
                  handleEndEditing();
                } else {
                  setEditing(true);
                }
              }}
            >
              <Edit />
            </IconButton>
          )}
        </Grid>
      </Grid>
    </Typography>
  );
}

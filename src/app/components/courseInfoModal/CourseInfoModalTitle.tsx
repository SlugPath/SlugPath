import { isCustomCourse } from "@/lib/plannerUtils";
import { Grid, Typography } from "@mui/joy";
import { ChangeEvent, useEffect } from "react";
import { Edit } from "@mui/icons-material";
import { StoredCourse } from "../../types/Course";
import { IconButton, Input } from "@mui/joy";

export default function CourseTitle({
  course,
  title,
  editing,
  setEditing,
  customTitle,
  handleTitleChange,
  handleEndEditing,
  term,
}: {
  course: StoredCourse;
  title: string;
  editing: boolean;
  setEditing: (editing: boolean) => void;
  customTitle: string;
  handleTitleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleEndEditing: () => void;
  term?: string;
}) {
  // If the course is a custom course, set the title to the custom title
  useEffect(() => {
    if (course && isCustomCourse(course)) {
      handleTitleChange({
        target: { value: course.title },
      } as ChangeEvent<HTMLInputElement>);
    }
  }, [course, handleTitleChange]);

  return (
    <Typography
      component="h2"
      id="modal-title"
      level="h4"
      textColor="inherit"
      fontWeight="lg"
      mb={1}
    >
      <Grid container alignItems="center" spacing="1">
        <Grid>
          {editing ? (
            <Input
              variant="soft"
              autoFocus
              value={customTitle}
              size="lg"
              placeholder={course.title}
              onChange={handleTitleChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleEndEditing();
              }}
              onBlur={handleEndEditing}
            />
          ) : (
            title
          )}
        </Grid>
        <Grid>
          {isCustomCourse(course) && term !== undefined && (
            <IconButton
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

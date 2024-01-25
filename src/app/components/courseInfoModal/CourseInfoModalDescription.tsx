import { isCustomCourse } from "@/lib/plannerUtils";
import { IconButton, Textarea, Typography } from "@mui/joy";
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
  handleDescriptionChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  handleEndEditing: () => void;
  term?: string;
}) {
  return (
    <Typography component="p" id="modal-description" textColor="inherit" mb={1}>
      <div className="flex flex-row items-center gap-2 ">
        {editing ? (
          <>
            <Textarea
              variant="soft"
              autoFocus
              value={customDescription}
              size="md"
              placeholder={course.description}
              onChange={handleDescriptionChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleEndEditing();
              }}
              sx={{
                overflow: "auto",
                width: "48rem",
              }}
              className="border-0"
              onBlur={handleEndEditing}
            />
          </>
        ) : (
          <p
            className="overflow-auto"
            style={{ whiteSpace: "normal", wordWrap: "break-word" }}
          >
            {description}
          </p>
        )}
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
      </div>
    </Typography>
  );
}

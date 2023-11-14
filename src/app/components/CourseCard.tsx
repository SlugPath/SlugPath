import { Card, CardContent, Grid, Typography } from "@mui/joy";
import { StoredCourse } from "../types/Course";
import { getTitle } from "../../lib/courseUtils";
import { useState } from "react";
import { DraggableProvided } from "@hello-pangea/dnd";

export default function CourseCard({
  course,
  index,
  alreadyAdded,
  onDelete,
  provided,
  isDragging,
}: {
  course: StoredCourse;
  index: number;
  alreadyAdded?: boolean;
  onDelete: undefined | ((index: number) => void);
  provided: DraggableProvided;
  isDragging: boolean;
}) {
  const [showDelete, setShowDelete] = useState(false);
  const margin = 2;
  const getItemStyle = (draggableStyle: any) => ({
    userSelect: "none",
    margin: `0 0 ${margin}px 0`,
    ...draggableStyle,
  });

  return (
    <Card
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      size="sm"
      variant={alreadyAdded ? "soft" : "outlined"}
      className={isDragging ? "bg-gray-200" : alreadyAdded ? "" : "bg-white"}
      style={{
        ...getItemStyle(provided.draggableProps.style),
        height: "35px",
        justifyContent: "center",
      }}
    >
      <CardContent>
        <Grid container alignItems="center" justifyContent="center" spacing={1}>
          <Grid xs={10}>
            <Typography level="body-sm">
              {course
                ? getTitle(course.department, course.number)
                : "No course"}
            </Typography>
          </Grid>
          <Grid xs={2}>
            {onDelete !== undefined && (
              <button
                onMouseEnter={() => setShowDelete(true)}
                onMouseLeave={() => setShowDelete(false)}
                onClick={() => onDelete(index)}
                style={{ opacity: showDelete ? 1 : 0.2 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="black"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

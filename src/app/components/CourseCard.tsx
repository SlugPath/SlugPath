import { Card, CardContent, Grid, IconButton, Typography } from "@mui/joy";
import { Draggable } from "@hello-pangea/dnd";
import { StoredCourse } from "../types/Course";
import { getTitle } from "../../lib/courseUtils";
import { useState } from "react";
import { Delete } from "@mui/icons-material";

export default function CourseCard({
  course,
  index,
  draggableId,
  alreadyAdded,
  onDelete,
}: {
  course: StoredCourse;
  index: number;
  draggableId: string;
  alreadyAdded?: boolean;
  onDelete: undefined | ((index: number) => void);
}) {
  const [showDelete, setShowDelete] = useState(false);
  const margin = 2;
  const getItemStyle = (draggableStyle: any) => ({
    userSelect: "none",
    margin: `0 0 ${margin}px 0`,
    ...draggableStyle,
  });

  return (
    <Draggable
      key={draggableId}
      draggableId={draggableId}
      index={index}
      isDragDisabled={alreadyAdded}
    >
      {(provided, snapshot) => {
        return (
          <div>
            <Card
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              size="sm"
              variant={alreadyAdded ? "soft" : "outlined"}
              className={snapshot.isDragging ? "bg-gray-200" : ""}
              style={{
                ...getItemStyle(provided.draggableProps.style),
                height: "35px",
              }}
            >
              <CardContent>
                <Grid
                  container
                  alignItems="center"
                  justifyContent="center"
                  spacing={1}
                >
                  <Grid xs={10}>
                    <Typography level="body-sm">
                      {course
                        ? getTitle(course.department, course.number)
                        : "No course"}
                    </Typography>
                  </Grid>
                  <Grid xs={2}>
                    {onDelete !== undefined && (
                      <IconButton
                        size="sm"
                        onMouseEnter={() => setShowDelete(true)}
                        onMouseLeave={() => setShowDelete(false)}
                        onClick={() => onDelete(index)}
                        style={{ opacity: showDelete ? 1 : 0.2 }}
                      >
                        <Delete />
                      </IconButton>
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </div>
        );
      }}
    </Draggable>
  );
}

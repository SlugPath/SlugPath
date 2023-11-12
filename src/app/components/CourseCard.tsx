import { Card, CardContent, Grid, IconButton, Typography } from "@mui/joy";
import { Draggable } from "@hello-pangea/dnd";
import { StoredCourse } from "../ts-types/Course";
import { getTitle } from "../logic/Courses";
import { useState } from "react";
import { Delete } from "@mui/icons-material";

export default function CourseCard({
  course,
  index,
  draggableId,
  onDelete,
}: {
  course: StoredCourse;
  index: number;
  draggableId: string;
  onDelete: undefined | ((index: number) => void);
}) {
  const [showDelete, setShowDelete] = useState(false);
  return (
    <Draggable key={draggableId} draggableId={draggableId} index={index}>
      {(provided) => {
        return (
          <div
            onMouseOver={() => onDelete !== undefined && setShowDelete(true)}
            onMouseOut={() => onDelete !== undefined && setShowDelete(false)}
          >
            <Card
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              size="sm"
            >
              <CardContent>
                <Grid
                  container
                  alignItems="center"
                  justifyContent="center"
                  spacing={1}
                >
                  <Grid xs={10}>
                    <Typography level="body-md">
                      {course
                        ? getTitle(course.department, course.number)
                        : "No course"}
                    </Typography>
                  </Grid>
                  <Grid xs={2}>
                    {onDelete !== undefined && (
                      <IconButton
                        size="sm"
                        onClick={() => onDelete(index)}
                        style={{ opacity: showDelete ? 1 : 0 }}
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

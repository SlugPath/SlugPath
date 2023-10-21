import * as React from 'react';
import { Card, Typography } from "@mui/joy";
import { Draggable } from "react-beautiful-dnd";
import { Course } from "../ts-types/Course";

export default function CourseCard({ course, index }: { course: Course, index: number }) {
  const title = `${course.department} ${course.number}`;

  return (
    <Draggable key={course.id} draggableId={course.id} index={index} >
      {(provided) => {
        return (
          <Card
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            size="sm"
          >
            <Typography level='body-md' >
              {title}
            </Typography>
          </Card>
        )
      }}
    </Draggable>
  )
}
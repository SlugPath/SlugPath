import {
  Card,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  Input,
} from "@mui/joy";
import { Add, InfoOutlined } from "@mui/icons-material";
import DraggableCourseCard from "./DraggableCourseCard";
import { Droppable } from "@hello-pangea/dnd";
import { PlannerContext } from "../contexts/PlannerProvider";
import { ChangeEvent, useContext, useEffect, useMemo, useState } from "react";
import { createCourseDraggableId } from "@/lib/plannerUtils";

const MAX_CUSTOM_COURSES = 3;

export default function CustomCourseSelection() {
  const [courseTitle, setCourseTitle] = useState("");
  const [tooManyError, setTooManyError] = useState(false);
  const [tooShortError, setTooShortError] = useState(false);
  const { customCourses, handleAddCustom } = useContext(PlannerContext);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTooShortError(false);
    setCourseTitle(e.target.value);
  };

  const handleAdd = () => {
    if (customCourses.length == MAX_CUSTOM_COURSES) {
      setTooManyError(true);
      return;
    }
    if (courseTitle.length == 0) {
      setTooShortError(true);
      return;
    }
    setTooShortError(false);
    setTooManyError(false);
    handleAddCustom(courseTitle);
    setCourseTitle("");
  };

  const memoLength = useMemo(() => {
    return customCourses.length == MAX_CUSTOM_COURSES;
  }, [customCourses]);

  useEffect(() => {
    if (!memoLength) setTooManyError(false);
  }, [memoLength]);

  return (
    <Card className="w-80 mb-2" variant="plain">
      <FormControl error={tooManyError || tooShortError}>
        <Grid container alignItems="center" justifyContent="center" spacing={1}>
          <Grid xs={10}>
            <Input
              placeholder="Custom Course"
              value={courseTitle}
              sx={{
                "--Input-focusedInset": "var(--any, )",
                "--Input-focusedThickness": "0.25rem",
                "--Input-focusedHighlight": "rgba(13,110,253,.25)",
                "&::before": {
                  transition: "box-shadow .15s ease-in-out",
                },
                "&:focus-within": {
                  borderColor: "#86b7fe",
                },
              }}
              onChange={handleChange}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
          </Grid>
          <Grid xs={2}>
            <IconButton onClick={() => handleAdd()}>
              <Add color="primary" />
            </IconButton>
          </Grid>
        </Grid>
        {tooManyError && (
          <FormHelperText>
            <InfoOutlined />
            Too many custom courses. Remove one.
          </FormHelperText>
        )}
        {tooShortError && (
          <FormHelperText>
            <InfoOutlined />
            Course name cannot be empty.
          </FormHelperText>
        )}
      </FormControl>

      <Droppable droppableId="custom-droppable">
        {(provided) => {
          return (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{ height: "100%" }}
            >
              {customCourses.map((course, index) => (
                <DraggableCourseCard
                  key={index}
                  course={course}
                  index={index}
                  draggableId={createCourseDraggableId(course, "custom")}
                  isCustom
                />
              ))}
              {provided.placeholder}
            </div>
          );
        }}
      </Droppable>
    </Card>
  );
}

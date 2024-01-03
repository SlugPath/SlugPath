import { Card, FormControl, FormHelperText, IconButton, Input } from "@mui/joy";
import { Add, InfoOutlined } from "@mui/icons-material";
import DraggableCourseCard from "./DraggableCourseCard";
import { Droppable } from "@hello-pangea/dnd";
import { PlannerContext } from "../contexts/PlannerProvider";
import { ChangeEvent, useContext, useEffect, useMemo, useState } from "react";
import { createCourseDraggableId } from "@/lib/plannerUtils";

const MAX_CUSTOM_COURSES = 3;

export default function CustomCourseSelection() {
  const [courseTitle, setCourseTitle] = useState("");
  const [credits, setCredits] = useState(5);

  const [tooManyError, setTooManyError] = useState(false);
  const [invalidCreditsError, setInvalidCreditsError] = useState(false);
  const [tooShortError, setTooShortError] = useState(false);
  const { customCourses, handleAddCustom } = useContext(PlannerContext);

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTooShortError(false);
    setCourseTitle(e.target.value);
  };

  const handleCreditChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInvalidCreditsError(false);
    setCredits(parseInt(e.target.value));
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
    if (credits < 0 || credits > 15) {
      setInvalidCreditsError(true);
      return;
    }
    setTooShortError(false);
    setTooManyError(false);
    setInvalidCreditsError(false);
    handleAddCustom(courseTitle);
    setCourseTitle("");
    setCredits(5);
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
        <FormHelperText>Course Title</FormHelperText>
        <Input
          placeholder="Custom Course"
          value={courseTitle}
          variant="soft"
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
          onChange={handleTitleChange}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
      </FormControl>
      <FormControl error={invalidCreditsError}>
        <FormHelperText>Credits</FormHelperText>
        <Input
          type="number"
          placeholder="Credits"
          defaultValue={5}
          value={credits}
          onChange={handleCreditChange}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <IconButton onClick={() => handleAdd()}>
          <Add color="primary" />
        </IconButton>
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
        {invalidCreditsError && (
          <FormHelperText>
            <InfoOutlined />
            Credits must be between 1 and 15.
          </FormHelperText>
        )}
      </FormControl>

      {customCourses.length > 0 && (
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
                    draggableId={createCourseDraggableId({
                      ...course,
                      suffix: "custom",
                    })}
                    isCustom
                  />
                ))}
                {provided.placeholder}
              </div>
            );
          }}
        </Droppable>
      )}
    </Card>
  );
}

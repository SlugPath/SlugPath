import {
  Card,
  CardContent,
  Grid,
  IconButton,
  Link,
  Typography,
} from "@mui/joy";
import { StoredCourse } from "../types/Course";
import { getTitle } from "../../lib/courseUtils";
import { useContext, useState } from "react";
import { DraggableProvided } from "@hello-pangea/dnd";
import CloseIcon from "@mui/icons-material/Close";
import { PlannerContext } from "../contexts/PlannerProvider";
import { ModalsContext } from "../contexts/ModalsProvider";
import CourseLabel from "./CourseLabel";

export default function CourseCard({
  course,
  index,
  alreadyAdded,
  quarterId,
  provided,
  isDragging,
}: {
  course: StoredCourse;
  index: number;
  alreadyAdded?: boolean;
  quarterId?: string;
  provided: DraggableProvided;
  isDragging: boolean;
}) {
  const { deleteCourse } = useContext(PlannerContext);
  const { onShowCourseInfoModal } = useContext(ModalsContext);
  const [highlighted, setHighlighted] = useState(false);
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
      style={{
        ...getItemStyle(provided.draggableProps.style),
        height: "35px",
        justifyContent: "center",
        backgroundColor:
          isDragging || highlighted ? "#E5E7EB" : alreadyAdded ? "" : "#FFFFFF",
      }}
      onMouseEnter={() => setHighlighted(true)}
      onMouseLeave={() => setHighlighted(false)}
    >
      <CardContent>
        <Grid container alignItems="center" justifyContent="center" spacing={1}>
          <Grid xs={10} className="flex flex-row whitespace-nowrap">
            <Title
              course={course}
              onShowCourseInfoModal={onShowCourseInfoModal}
            />
            <CourseLabelList course={course} />
          </Grid>
          <Grid xs={2}>
            {quarterId !== undefined && (
              <DeleteIcon
                onClick={() => deleteCourse(quarterId)(index)}
                highlighted={highlighted}
              />
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

const Title = ({
  course,
  onShowCourseInfoModal,
}: {
  course: StoredCourse;
  onShowCourseInfoModal: (course: StoredCourse) => void;
}) => {
  return (
    <Typography level="body-sm">
      <Link
        overlay
        underline="none"
        href="#interactive-card"
        sx={{ color: "text.tertiary" }}
        onClick={() => onShowCourseInfoModal(course)}
      >
        {course ? getTitle(course.department, course.number) : "No course"}
      </Link>
    </Typography>
  );
};

const CourseLabelList = ({ course }: { course: StoredCourse }) => {
  return (
    <div className="flex truncate">
      {course.labels
        ? course.labels.map((label, index) => (
            <CourseLabel key={index} label={label} displayText={false} />
          ))
        : null}
    </div>
  );
};

const DeleteIcon = ({
  onClick,
  highlighted,
}: {
  onClick: () => void;
  highlighted: boolean;
}) => {
  return (
    <IconButton
      onClick={onClick}
      variant="plain"
      size="sm"
      className={`bg-gray-200 hover:bg-gray-300 ${
        highlighted ? "" : "invisible"
      }`}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  );
};

import { MAX_VISIBLE_COURSE_TITLE } from "@/lib/consts";
import {
  extractTermFromQuarter,
  geLabels,
  getDeptAndNumber,
  isCSE,
  isCustomCourse,
  isOffered,
} from "@/lib/plannerUtils";
import { truncateTitle } from "@/lib/utils";
import CloseIconButton from "@components/buttons/CloseIconButton";
import { ModalsContext } from "@contexts/ModalsProvider";
import { PlannerContext } from "@contexts/PlannerProvider";
import { CourseTerm, StoredCourse } from "@customTypes/Course";
import { Label } from "@customTypes/Label";
import { DraggableProvided } from "@hello-pangea/dnd";
import { WarningAmberRounded } from "@mui/icons-material";
import { Card, CardContent, Grid, Link, Typography } from "@mui/joy";
import { useContext, useState } from "react";

import CourseLabel from "./CourseLabel";

export interface CourseCardProps {
  course: StoredCourse;
  index: number;
  provided: DraggableProvided;
  isCustom: boolean;
  quarterId?: string;
  customDeleteCourse?: () => void;
}

export default function CourseCard({
  course,
  index,
  quarterId,
  provided,
  isCustom,
  customDeleteCourse,
}: CourseCardProps) {
  const {
    deleteCourse,
    setDisplayCourse,
    getCourseLabels,
    handleRemoveCustom,
  } = useContext(PlannerContext);
  const { onShowCourseInfoModal } = useContext(ModalsContext);
  const [highlighted, setHighlighted] = useState(false);
  const margin = 2;
  const getItemStyle = (draggableStyle: any) => ({
    userSelect: "none",
    margin: `0 0 ${margin}px 0`,
    ...draggableStyle,
  });
  const isEnrolledCourse = quarterId !== undefined;

  function handleShowCourseInfoModal(course: StoredCourse) {
    const courseTerm = [
      course,
      extractTermFromQuarter(quarterId),
    ] as CourseTerm;
    setDisplayCourse(courseTerm);
    onShowCourseInfoModal();
  }

  function cardColor() {
    if (isCustomCourse(course)) {
      return "warning";
    } else if (isEnrolledCourse) {
      return "primary";
    } else {
      return "neutral";
    }
  }

  function handleDeleteCourse(quarterId: string, index: number) {
    if (customDeleteCourse) {
      customDeleteCourse();
    } else {
      deleteCourse(quarterId)(index);
    }
  }

  return (
    <Card
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      size="sm"
      variant="soft"
      color={cardColor()}
      className="hover:opacity-50"
      style={{
        ...getItemStyle(provided.draggableProps.style),
        height: "35px",
        justifyContent: "center",
      }}
      onMouseEnter={() => setHighlighted(true)}
      onMouseLeave={() => setHighlighted(false)}
    >
      <CardContent>
        <Grid container alignItems="center" justifyContent="start" spacing={1}>
          <Grid xs={10} className="flex flex-row whitespace-nowrap">
            <Title
              course={course}
              onShowCourseInfoModal={handleShowCourseInfoModal}
              quarterId={quarterId}
            />
            <CourseLabelList labels={getCourseLabels(course)} ge={course.ge} />
          </Grid>
          <Grid xs={1}>
            {quarterId !== undefined && (
              <CloseIconButton
                onClick={() => handleDeleteCourse(quarterId, index)}
                sx={{
                  visibility: highlighted ? "visible" : "hidden",
                }}
              />
            )}
            {isCustom && (
              <CloseIconButton
                onClick={() => handleRemoveCustom(index)}
                sx={{
                  visibility: highlighted ? "visible" : "hidden",
                }}
              />
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

interface TitleProps {
  course: StoredCourse;
  onShowCourseInfoModal: (course: StoredCourse) => void;
  quarterId?: string;
}
const Title = ({ course, onShowCourseInfoModal, quarterId }: TitleProps) => {
  return (
    <Typography
      endDecorator={
        course &&
        isCSE(course) &&
        !isOffered(
          course.quartersOffered,
          extractTermFromQuarter(quarterId),
        ) && <WarningAmberRounded color="warning" />
      }
    >
      <Link
        overlay
        underline="none"
        sx={{ color: "text.tertiary" }}
        onClick={() => onShowCourseInfoModal(course)}
      >
        {truncateTitle(
          course ? getDeptAndNumber(course) : "No course",
          MAX_VISIBLE_COURSE_TITLE,
        )}
      </Link>
    </Typography>
  );
};

const CourseLabelList = ({ labels, ge }: { labels: Label[]; ge: string[] }) => {
  const allLabels = [...geLabels(ge), ...labels];

  return (
    <div className="flex truncate">
      {allLabels
        ? allLabels.map((label, index) => (
            <CourseLabel key={index} label={label} displayText={false} />
          ))
        : null}
    </div>
  );
};

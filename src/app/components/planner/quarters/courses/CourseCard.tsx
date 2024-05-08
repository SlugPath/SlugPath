import {
  extractTermFromQuarter,
  geLabels,
  getDeptAndNumber,
  isCustomCourse,
  isOffered,
  isTransferCourse,
} from "@/lib/plannerUtils";
import CloseIconButton from "@components/buttons/CloseIconButton";
import { CourseInfoContext } from "@contexts/CourseInfoProvider";
import { PlannerContext } from "@contexts/PlannerProvider";
import { CourseTerm, StoredCourse } from "@customTypes/Course";
import { Label } from "@customTypes/Label";
import { DraggableProvided } from "@hello-pangea/dnd";
import { WarningAmberRounded } from "@mui/icons-material";
import { Card, CardContent, Grid, Link, Typography } from "@mui/joy";
import { useMediaQuery } from "@mui/material";
import { useContext, useState } from "react";

import CourseLabel from "./CourseLabel";

export interface CourseCardProps {
  course: StoredCourse;
  index: number;
  isCustom?: boolean;
  provided?: DraggableProvided;
  quarterId?: string;
  customDeleteCourse?: () => void;
}

export default function CourseCard({
  course,
  index,
  quarterId,
  provided,
  isCustom = false,
  customDeleteCourse,
}: CourseCardProps) {
  const { deleteCourse, getCourseLabels, handleRemoveCustom } =
    useContext(PlannerContext);
  const { setDisplayCourse, setQuarterCourseIndex, onShowCourseInfoModal } =
    useContext(CourseInfoContext);
  const [highlighted, setHighlighted] = useState(false);
  const margin = 2;
  const getItemStyle = (draggableStyle: any) => ({
    userSelect: "none",
    margin: `0 0 ${margin}px 0`,
    ...draggableStyle,
  });
  const isEnrolledCourse = quarterId !== undefined;
  const isTouchDevice = useMediaQuery("(hover: none) and (pointer: coarse)");
  const isMobileView = useMediaQuery("((max-width: 1000px))");
  const isTouchDesktop = isTouchDevice && !isMobileView;

  function handleShowCourseInfoModal(course: StoredCourse) {
    const courseTerm = [
      course,
      extractTermFromQuarter(quarterId),
    ] as CourseTerm;
    setDisplayCourse(courseTerm);
    setQuarterCourseIndex([quarterId, index]);
    onShowCourseInfoModal();
  }

  function cardColor() {
    if (isCustomCourse(course)) {
      return "custom";
    } else if (isTransferCourse(course)) {
      return "transfer";
    } else if (isEnrolledCourse) {
      return "primary";
    } else {
      return "neutral";
    }
  }

  function handleDeleteCourse(quarterId: string | undefined, index: number) {
    if (!quarterId) return;
    if (customDeleteCourse) {
      customDeleteCourse();
    } else {
      deleteCourse(quarterId)(index);
    }
  }

  return (
    <Card
      ref={provided?.innerRef}
      {...provided?.draggableProps}
      {...provided?.dragHandleProps}
      size="sm"
      variant="soft"
      color={cardColor()}
      className="hover:opacity-50"
      style={{
        ...getItemStyle(provided?.draggableProps.style),
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
            <CourseLabelList
              labels={getCourseLabels ? getCourseLabels(course) : []}
              ge={course.ge}
            />
          </Grid>
          <Grid xs={1} className="hidden md:flex">
            {/* Show delete icon only if the course is in the planner or in the custom course selection */}
            {quarterId !== undefined ? (
              isCustom ? (
                <CloseIconButton
                  onClick={() => handleRemoveCustom(index)}
                  sx={{
                    visibility: isTouchDesktop
                      ? "hidden"
                      : highlighted
                      ? "visible"
                      : "hidden",
                  }}
                />
              ) : (
                <CloseIconButton
                  onClick={() => handleDeleteCourse(quarterId, index)}
                  sx={{
                    visibility: isTouchDesktop
                      ? "hidden"
                      : highlighted
                      ? "visible"
                      : "hidden",
                  }}
                />
              )
            ) : null}
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
  const checkOffered = course && isCustomCourse(course);
  return (
    <Typography
      className="truncate text-ellipsis"
      endDecorator={
        checkOffered &&
        !isOffered(
          course.quartersOffered,
          extractTermFromQuarter(quarterId),
        ) && <WarningAmberRounded color="warning" />
      }
    >
      <Link
        overlay
        underline="none"
        sx={{
          color: "text.tertiary",
        }}
        onClick={() => onShowCourseInfoModal(course)}
      >
        {course
          ? getDeptAndNumber(course) +
            (isTransferCourse(course) ? ` at ${course.school}` : "")
          : "No course"}
      </Link>
    </Typography>
  );
};

const CourseLabelList = ({ labels, ge }: { labels: Label[]; ge: string[] }) => {
  const allLabels = [...geLabels(ge), ...labels];

  return (
    <div className="flex truncate">
      {allLabels?.map((label, index) => (
        <CourseLabel key={index} label={label} displayText={false} />
      ))}
    </div>
  );
};

import { ModalsContext } from "@/app/contexts/ModalsProvider";
import { PlannerContext } from "@/app/contexts/PlannerProvider";
import { CourseTerm } from "@/app/types/Course";
import { StoredCourse } from "@/graphql/planner/schema";
import { isCustomCourse } from "@/lib/plannerUtils";
import { Card, Link } from "@mui/joy";
import { useContext } from "react";

import { Quarter } from "../../types/Quarter";

export function MiniCourseCard({
  course,
  quarter,
}: {
  course: StoredCourse;
  quarter: Quarter;
}) {
  const { setDisplayCourse } = useContext(PlannerContext);
  const { onShowCourseInfoModal } = useContext(ModalsContext);

  function courseTitle(course: StoredCourse) {
    if (course.departmentCode && course.number) {
      return `${course.departmentCode} ${course.number}`;
    }
    return course.title;
  }

  function handleClickedCourse(course: StoredCourse) {
    const courseTerm = [course, quarter.title] as CourseTerm;
    setDisplayCourse(courseTerm);
    onShowCourseInfoModal();
  }

  return (
    <Card
      size="sm"
      color={isCustomCourse(course) ? "warning" : "primary"}
      sx={{
        p: 0.1,
        pl: 1,
      }}
      variant="soft"
      className="hover:opacity-50"
    >
      <Link
        overlay
        underline="none"
        sx={{ color: "text.tertiary" }}
        onClick={() => handleClickedCourse(course)}
      >
        {courseTitle(course)}
      </Link>
    </Card>
  );
}

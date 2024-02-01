import { isCustomCourse } from "@/lib/plannerUtils";
import { ModalsContext } from "@contexts/ModalsProvider";
import { PlannerContext } from "@contexts/PlannerProvider";
import { CourseTerm, StoredCourse } from "@customTypes/Course";
import { Quarter } from "@customTypes/Quarter";
import { Card, Link, Typography } from "@mui/joy";
import { useContext } from "react";

export interface MiniQuarterCardProps {
  quarter: Quarter;
  courses: StoredCourse[];
}

export default function MiniQuarterCard({
  quarter,
  courses,
}: MiniQuarterCardProps) {
  return (
    <Card size="sm" className="w-full" variant="plain">
      <div className="space-y-1">
        <Typography level="body-sm">{quarter.title}</Typography>
        {courses.map((course, index) => (
          <MiniCourseCard key={index} course={course} quarter={quarter} />
        ))}
      </div>
    </Card>
  );
}

function MiniCourseCard({
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

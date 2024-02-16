import { isCustomCourse } from "@/lib/plannerUtils";
import { CourseInfoContext } from "@contexts/CourseInfoProvider";
import { CourseTerm, StoredCourse } from "@customTypes/Course";
import { Quarter } from "@customTypes/Quarter";
import { Card, Link } from "@mui/joy";
import { useContext } from "react";

export function MiniCourseCard({
  course,
  quarter,
}: {
  course: StoredCourse;
  quarter: Quarter;
}) {
  const { onShowCourseInfoModal, setDisplayCourse } =
    useContext(CourseInfoContext);

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

import { isCustomCourse } from "@/lib/plannerUtils";
import { CourseInfoContext } from "@contexts/CourseInfoProvider";
import { CourseTerm, StoredCourse } from "@customTypes/Course";
import { Card, Link } from "@mui/joy";
import { useContext } from "react";

export function MiniCourseCard({
  course,
  quarterTitle,
}: {
  course: StoredCourse;
  quarterTitle?: string;
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
    const courseTerm = [course, quarterTitle] as CourseTerm;
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
        className="font-medium"
      >
        {courseTitle(course)}
      </Link>
    </Card>
  );
}

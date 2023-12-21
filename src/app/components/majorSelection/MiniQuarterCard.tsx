import { StoredCourse } from "@/graphql/planner/schema";
import { Card, CssVarsProvider, Link, Typography } from "@mui/joy";
import { Quarter } from "../../types/Quarter";
import { isCustomCourse } from "@/lib/plannerUtils";
import { PlannerContext } from "@/app/contexts/PlannerProvider";
import { ModalsContext } from "@/app/contexts/ModalsProvider";
import { useContext } from "react";

export default function MiniQuarterCard({
  quarter,
  courses,
}: {
  quarter: Quarter;
  courses: StoredCourse[];
}) {
  return (
    <Card size="sm" className="w-full" variant="plain">
      <CssVarsProvider defaultMode="system">
        <div className="space-y-1">
          <Typography level="body-sm">{quarter.title}</Typography>
          {courses.map((course, index) => (
            <MiniCourseCard key={index} course={course} quarter={quarter} />
          ))}
        </div>
      </CssVarsProvider>
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
    const courseTerm = [course, quarter];
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

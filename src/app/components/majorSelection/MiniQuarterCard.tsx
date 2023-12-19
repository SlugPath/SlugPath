import { StoredCourse } from "@/graphql/planner/schema";
import { Card, CssVarsProvider, Typography } from "@mui/joy";
import { Quarter } from "../../types/Quarter";

export default function MiniQuarterCard({
  quarter,
  courses,
}: {
  quarter: Quarter;
  courses: StoredCourse[];
}) {
  function courseTitle(course: StoredCourse) {
    if (course.departmentCode && course.number) {
      return `${course.departmentCode} ${course.number}`;
    }
    return course.title;
  }

  return (
    <Card size="sm" className="w-full" variant="plain">
      <CssVarsProvider defaultMode="system">
        <div className="space-y-1">
          <Typography level="body-sm">{quarter.title}</Typography>
          {courses.map((course, index) => (
            <Card
              key={index}
              size="sm"
              color="primary"
              sx={{
                p: 0.1,
                pl: 1,
              }}
              variant="soft"
            >
              {courseTitle(course)}
            </Card>
          ))}
        </div>
      </CssVarsProvider>
    </Card>
  );
}

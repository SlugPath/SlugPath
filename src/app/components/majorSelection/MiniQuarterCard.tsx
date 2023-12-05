import { StoredCourse } from "@/graphql/planner/schema";
import { Typography, Card } from "@mui/joy";
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
    <Card size="sm" className="w-full">
      <Typography level="body-md">{quarter.title}</Typography>
      {courses.map((course, index) => (
        <div key={index} className="pl-4">
          <li>{courseTitle(course)}</li>
        </div>
      ))}
    </Card>
  );
}

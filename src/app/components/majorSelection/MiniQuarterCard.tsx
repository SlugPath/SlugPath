import { StoredCourse } from "@/graphql/planner/schema";
import { Card, Typography } from "@mui/joy";
import { Quarter } from "../../types/Quarter";
import { MiniCourseCard } from "./MiniCourseCard";

export default function MiniQuarterCard({
  quarter,
  courses,
}: {
  quarter: Quarter;
  courses: StoredCourse[];
}) {
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

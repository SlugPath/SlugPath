import { StoredCourse } from "@/graphql/planner/schema";
import { Quarter } from "@customTypes/Quarter";
import { Card, Typography } from "@mui/joy";

import { MiniCourseCard } from "./MiniCourseCard";

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

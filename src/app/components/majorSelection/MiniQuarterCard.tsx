import { StoredCourse } from "@/graphql/planner/schema";
import { Card, ListItem, List } from "@mui/joy";
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
    <Card
      size="sm"
      className="w-full"
      sx={{
        minHeight: "6rem",
      }}
    >
      {/* <Typography level="body-sm">{quarter.title}</Typography> */}
      <div>{quarter.title}</div>
      <List
        marker="disc"
        sx={{
          "--ListItem-minHeight": "24px",
        }}
      >
        {courses.map((course, index) => (
          <ListItem key={index}>{courseTitle(course)}</ListItem>
        ))}
      </List>
    </Card>
  );
}

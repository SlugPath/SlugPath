import { getMoreEnrollmentInfo } from "@actions/enrollment";
import { StoredCourse } from "@customTypes/Course";
import Info from "@mui/icons-material/Info";
import {
  Accordion,
  AccordionDetails,
  AccordionGroup,
  AccordionSummary,
  Card,
  Typography,
} from "@mui/joy";
import { useQuery } from "@tanstack/react-query";

export interface MoreEnrollInfoProps {
  course?: StoredCourse;
}

export default function MoreEnrollInfo({ course }: MoreEnrollInfoProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["currentEnrollInfo", course?.departmentCode, course?.number],
    queryFn: async () => await getMoreEnrollmentInfo(course!),
    enabled: course !== undefined,
  });

  if (isLoading) return null;

  return (
    <>
      <Typography component="h2" level="h4" textColor="inherit" fontWeight="md">
        Upcoming Enrollment Info for {course?.departmentCode} {course?.number}
      </Typography>
      <div className="overflow-y-scroll w-full" style={{ maxHeight: "25vh" }}>
        <AccordionGroup>
          {data?.map((off, i) => (
            <Accordion key={i}>
              <AccordionSummary indicator={<Info />}>
                {off.term.title} {off.term.catalogYear}, Section{" "}
                {off.class_section}
              </AccordionSummary>
              <AccordionDetails>
                <Card>
                  <Typography>Instructor: {off.instructor}</Typography>
                  <Typography>Meetings: {off.class_meeting}</Typography>
                </Card>
              </AccordionDetails>
            </Accordion>
          ))}
        </AccordionGroup>
      </div>
    </>
  );
}

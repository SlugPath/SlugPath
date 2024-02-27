import { getQuarterColor } from "@/lib/quarterUtils";
import { getMoreEnrollmentInfo } from "@actions/enrollment";
import { StoredCourse } from "@customTypes/Course";
import { Groups, LocationOn, People, Person } from "@mui/icons-material";
import Info from "@mui/icons-material/Info";
import {
  Accordion,
  AccordionDetails,
  AccordionGroup,
  AccordionSummary,
  Card,
  Chip,
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

  if (data && data.length === 0) return null;

  return (
    <>
      <Typography component="h2" level="h4" textColor="inherit" fontWeight="md">
        Current & Upcoming Enrollment Information for {course?.departmentCode}{" "}
        {course?.number}
      </Typography>
      <div className="overflow-y-scroll w-full" style={{ maxHeight: "25vh" }}>
        <AccordionGroup>
          {data?.map((off, i) => (
            <Accordion key={i}>
              <AccordionSummary indicator={<Info />}>
                <Chip color={getQuarterColor(off.term.title)}>
                  {off.term.title} {off.term.catalogYear} Section{" "}
                  {off.class_section}
                </Chip>
              </AccordionSummary>
              <AccordionDetails>
                <Card>
                  <Typography>
                    <span className="flex items-center gap-2">
                      <Person />
                      Instructor: {off.instructor}
                    </span>
                  </Typography>
                  <Typography>
                    <span className="flex items-center gap-2">
                      <LocationOn />
                      Meetings: {off.class_meeting}
                    </span>
                  </Typography>
                  <Typography>
                    <span className="flex items-center gap-2">
                      <Groups />
                      {off.enrolled}
                    </span>
                  </Typography>
                  <Typography>
                    <span className="flex items-center gap-2">
                      <People />
                      {off.waitlist_total} waitlisted
                    </span>
                  </Typography>
                </Card>
              </AccordionDetails>
            </Accordion>
          ))}
        </AccordionGroup>
      </div>
    </>
  );
}

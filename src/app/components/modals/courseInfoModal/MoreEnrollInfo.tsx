import { lookupQuarterColor } from "@/lib/quarterUtils";
import { getMoreEnrollmentInfo } from "@actions/enrollment";
import { StoredCourse } from "@customTypes/Course";
import { Groups, LocationOn, People, Person } from "@mui/icons-material";
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
    staleTime: 15 * 60 * 1000,
  });

  if (isLoading) return null;

  if (data && data.length === 0) return null;

  return (
    <>
      <Typography component="p" textColor="inherit">
        Current & Upcoming Enrollment Information
      </Typography>
      <div className="overflow-y-scroll w-full" style={{ maxHeight: "20vh" }}>
        <AccordionGroup>
          {data?.map((off, i) => (
            <Accordion key={i}>
              <AccordionSummary>
                <Chip color={lookupQuarterColor(off.term.title)}>
                  {off.term.title} {off.term.catalogYear} Section{" "}
                  {off.class_section}
                </Chip>
              </AccordionSummary>
              <AccordionDetails>
                <Card variant="soft">
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

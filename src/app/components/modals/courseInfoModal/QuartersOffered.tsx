import {
  Sheet,
  Tab,
  TabList,
  TabPanel,
  Table,
  Tabs,
  Typography,
} from "@mui/joy";

//import { getQuarterColor } from "@/lib/quarterUtils";

/* export default function QuartersOffered({
  enrollmentInfo,
}: {
  enrollmentInfo: Array<{ term: { title: string; catalogYear: string }; instructor: string }>;
}) {
  const renderOfferingsForYear = (year: string ) => {
    const offeringsForYear = enrollmentInfo.filter((e) => e.term.catalogYear === year);
    return (
      <div className="flex flex-wrap items-center gap-2" style={{ maxHeight: '200px', overflowY: 'auto' }}>
      {offeringsForYear.map((offer, index) => (
        <Chip key={index} color={getQuarterColor(offer.term.title)}>
          {offer.term.title}, {offer.instructor}
        </Chip>
      ))}
      </div>
    );
  };

  const years = ["20-21", "21-22", "22-23", "23-24"];

  return (
    <div>
      <Typography component="p">Quarters Offered:</Typography>
      <Tabs aria-label="Basic tabs" defaultValue={0} size="sm">
          <TabList>
              {years.map((year, index) => (
                  <Tab key={index}> {year}</Tab>
              ))}
          </TabList>
          {years.map((year, index) => (
              <TabPanel key={index} value={index}>
              {renderOfferingsForYear(year)}
              </TabPanel>
          ))}
      </Tabs>
  
    </div>
  );
} */

export default function QuartersOffered({
  enrollmentInfo,
}: {
  enrollmentInfo?: Array<{
    term: { title: string; catalogYear: string };
    instructor: string;
  }>;
}) {
  const renderOfferingsForYear = (year: string) => {
    if (!enrollmentInfo) {
      return null;
    }
    const offeringsForYear = enrollmentInfo.filter(
      (e) => e.term.catalogYear === year,
    );
    const quartersMap: Map<
      string,
      Array<{ instructor: string; offerings: number }>
    > = new Map();
    offeringsForYear.forEach((offer) => {
      const quarter = offer.term.title;
      const instructor = offer.instructor;
      const existingQuarter = quartersMap.get(quarter);
      if (existingQuarter) {
        // If the quarter already exists in the map, update the offerings count for the instructor
        const existingInstructor = existingQuarter.find(
          (item) => item.instructor === instructor,
        );
        if (existingInstructor) {
          existingInstructor.offerings++;
        } else {
          existingQuarter.push({ instructor, offerings: 1 });
        }
      } else {
        // If the quarter doesn't exist in the map, add it along with the instructor and offerings count
        quartersMap.set(quarter, [{ instructor, offerings: 1 }]);
      }
    });

    if (quartersMap.size === 0) {
      return null;
    }
    return (
      <Sheet
        sx={{
          maxHeight: 300,
          overflow: "auto",
        }}
      >
        <Table
          aria-label="table with sticky header"
          stickyHeader
          sx={(theme) => ({
            '& td[scope="Fall"]': { bgcolor: "warning.softBg" },
            '& td[scope="Winter"]': { bgcolor: "primary.softBg" },
            '& td[scope="Spring"]': { bgcolor: "success.softBg" },
            '& td[scope="Summer"]': { bgcolor: "danger.softBg" },
            "& td": theme.variants.soft.neutral,
          })}
        >
          <thead>
            <tr>
              <th scope="col">Quarter</th>
              <th scope="col">Professor</th>
              <th scope="col">Number of Offerings</th>
            </tr>
          </thead>
          <tbody>
            {Array.from(quartersMap.entries()).map(([quarter, instructors]) =>
              instructors.map(({ instructor, offerings }, index) => (
                <tr key={`${quarter}-${instructor}-${index}`}>
                  <td scope={quarter}>{quarter}</td>
                  <td scope={quarter}>{instructor}</td>
                  <td scope={quarter}>{offerings}</td>
                </tr>
              )),
            )}
          </tbody>
        </Table>
      </Sheet>
    );
  };

  const years = ["20-21", "21-22", "22-23", "23-24"];

  return (
    <div>
      <Typography component="p">Quarters Offered:</Typography>
      <Tabs aria-label="Basic tabs" defaultValue={0} size="sm">
        <TabList>
          {years.map((year, index) => (
            <Tab key={index}> {year}</Tab>
          ))}
        </TabList>
        {years.map((year, index) => (
          <TabPanel key={index} value={index}>
            {renderOfferingsForYear(year)}
          </TabPanel>
        ))}
      </Tabs>
    </div>
  );
}

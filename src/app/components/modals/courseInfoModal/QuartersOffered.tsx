import { getQuarterColor } from "@/lib/quarterUtils";
import {
  Chip,
  Sheet,
  Tab,
  TabList,
  TabPanel,
  Table,
  Tabs,
  Typography,
} from "@mui/joy";

export default function QuartersOffered({
  enrollmentInfo,
}: {
  enrollmentInfo?: Array<{
    term: { title: string; catalogYear: string };
    instructor: string;
  }>;
}) {
  const years = ["20-21", "21-22", "22-23", "23-24"];
  const quarters = ["Fall", "Winter", "Spring", "Summer"];

  if (!enrollmentInfo) {
    return null;
  }

  const getProfessorsForYearAndQuarter = (year: string, quarter: string) => {
    const professorsSet = new Set<string>();
    enrollmentInfo.forEach(({ term, instructor }) => {
      if (term.catalogYear === year && term.title === quarter) {
        professorsSet.add(instructor);
      }
    });
    return Array.from(professorsSet);
  };

  return (
    <div style={{ marginBottom: "-0.5rem" }}>
      <Typography component="p">Quarters Offered:</Typography>
      <Tabs
        aria-label="Basic tabs"
        defaultValue={0}
        size="sm"
        sx={{
          "--Tab-indicatorThickness": "3px",
          "--Tabs-spacing": "15px",
          bgcolor: "background.level1",
          borderRadius: "sm",
        }}
      >
        <TabList
          underlinePlacement="bottom"
          sx={{
            borderRadius: "0px",
            /*             bgcolor: 'background.level1',
            [`& .${tabClasses.root}[aria-selected="true"]`]: {
              boxShadow: 'sm',
              bgcolor: 'background.surface',
            }, */
          }}
        >
          {years.map((year, index) => (
            <Tab key={index}> 20{year}</Tab>
          ))}
        </TabList>
        {years.map((year, index) => (
          <TabPanel key={index} value={index}>
            <Sheet
              sx={{
                maxHeight: 300,
                overflow: "auto",
              }}
            >
              <Table
                aria-label="table with sticky header"
                stickyHeader
                borderAxis="both"
                sx={(theme) => ({
                  '& th[scope="col"]': theme.variants.outlined.neutral,
                })}
              >
                <thead>
                  <tr>
                    <th scope="col" style={{ width: "10%" }}>
                      Quarter
                    </th>
                    <th scope="col">Professors</th>
                  </tr>
                </thead>
                <tbody>
                  {quarters.map((quarter, index) => (
                    <tr key={index}>
                      <td>{quarter}</td>
                      <td>
                        <div className="flex justify-start flex-wrap items-center gap-2">
                          {getProfessorsForYearAndQuarter(year, quarter).map(
                            (professor, index) => (
                              <Chip
                                key={index}
                                color={getQuarterColor(
                                  quarter as
                                    | "Fall"
                                    | "Winter"
                                    | "Spring"
                                    | "Summer",
                                )}
                              >
                                {" "}
                                {professor}{" "}
                              </Chip>
                            ),
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Sheet>
          </TabPanel>
        ))}
      </Tabs>
    </div>
  );
}

import { getQuarterColor } from "@/lib/quarterUtils";
import { Chip, Sheet, Tab, TabList, TabPanel, Table, Tabs } from "@mui/joy";

export default function QuartersOfferedTable({
  enrollmentInfo,
}: {
  enrollmentInfo: Array<{
    term: { title: string; catalogYear: string };
    instructor: string;
  }>;
}) {
  const getProfessorsForYearAndQuarter = (year: string, quarter: string) => {
    const professorsSet = new Set<string>();
    enrollmentInfo.forEach(({ term, instructor }) => {
      if (term.catalogYear === year && term.title === quarter) {
        professorsSet.add(instructor);
      }
    });
    return Array.from(professorsSet);
  };

  const getUniqueYears = () => {
    if (!enrollmentInfo) return [];
    const years = new Set<string>();
    enrollmentInfo.forEach(({ term }) => {
      years.add(term.catalogYear);
    });
    return Array.from(years);
  };

  const years = getUniqueYears();
  const quarters = ["Fall", "Winter", "Spring", "Summer"];

  return (
    <div style={{ marginTop: "-0.25rem", marginBottom: "0.25rem" }}>
      <Tabs
        aria-label="Basic tabs"
        defaultValue={0}
        size="sm"
        sx={{
          "--Tab-indicatorThickness": "3px",
          "--Tabs-spacing": "15px",
          bgcolor: "background.level1",
          borderRadius: "sm",
          "& .MuiTab-root:first-child": {
            borderTopLeftRadius: "6px",
          },
        }}
      >
        <TabList
          underlinePlacement="bottom"
          sx={{
            borderRadius: "0px",
          }}
        >
          {years.map((year, index) => (
            <Tab key={index}> 20{year}</Tab>
          ))}
        </TabList>
        {years.map((year, index) => (
          <TabPanel key={index} value={index} sx={{ margin: "-0.25rem" }}>
            <Sheet
              sx={{
                maxHeight: 300,
                overflow: "auto",
                borderRadius: "sm",
              }}
            >
              <Table
                aria-label="table with sticky header"
                stickyHeader
                borderAxis="both"
                sx={(theme) => ({
                  '& th[scope="col"]': theme.variants.outlined.neutral,
                  borderRadius: "sm",
                  "& tbody > tr:last-child > td:first-child": {
                    borderBottomLeftRadius: "6px",
                  },
                  "& tbody > tr:last-child > td:last-child": {
                    borderBottomRightRadius: "6px",
                  },
                })}
              >
                <thead>
                  <tr>
                    <th
                      scope="col"
                      style={{
                        width: "10%",
                        textAlign: "center",
                      }}
                    >
                      Quarter
                    </th>
                    <th scope="col">Professors</th>
                  </tr>
                </thead>
                <tbody>
                  {quarters.map((quarter, index) => (
                    <tr key={index}>
                      <td style={{ textAlign: "center" }}>{quarter}</td>
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
                                {professor}
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

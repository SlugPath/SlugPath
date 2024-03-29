import { GESMappedToCourses } from "@/lib/plannerUtils";
import { PlannerData } from "@customTypes/Planner";
import { Typography, useColorScheme } from "@mui/joy";
import { blue } from "@mui/material/colors";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { useEffect, useState } from "react";

const satisfied = blue[200];
const satisfiedDark = blue[700];
const notSatisfied = blue[50];
const notSatisfiedDark = "#172554";

export default function GEProgress({
  ge,
  courseState,
}: {
  ge: string[];
  courseState: PlannerData;
}) {
  return <GEProgressModal ge={ge} courseState={courseState} />;
}

const GEProgressModal = ({
  ge,
  courseState,
}: {
  ge: string[];
  courseState: PlannerData;
}) => {
  const { mode } = useColorScheme();
  const mapOfGeToCourses = GESMappedToCourses({ courseState });

  const [data, setData] = useState([
    { id: 1, value: 10, label: "CC", color: "grey" },
    { id: 2, value: 10, label: "ER", color: "grey" },
    { id: 3, value: 10, label: "IM", color: "grey" },
    { id: 4, value: 10, label: "MF", color: "grey" },
    { id: 5, value: 10, label: "SI", color: "grey" },
    { id: 6, value: 10, label: "SR", color: "grey" },
    { id: 7, value: 10, label: "TA", color: "grey" },
    { id: 8, value: 10, label: "PE", color: "grey" },
    { id: 9, value: 10, label: "PR", color: "grey" },
    { id: 10, value: 10, label: "C", color: "grey" },
  ]);

  // Update the color of the pie slices when "ge" prop changes
  useEffect(() => {
    const PE_GE = ["peT", "peH", "peE"];
    const PR_GE = ["prC", "prE", "prS"];

    setData((currData) =>
      currData.map((item) => ({
        ...item,
        color:
          // If GE is satisfied, set the corresponding GE pie section to green, else set it to grey
          (item.label === "PE" && PE_GE.some((g) => ge.includes(g))) ||
          (item.label === "PR" && PR_GE.some((g) => ge.includes(g))) ||
          ge.includes(item.label.toLowerCase())
            ? mode == "light"
              ? satisfied
              : satisfiedDark
            : mode == "light"
            ? notSatisfied
            : notSatisfiedDark,
      })),
    );
  }, [ge, mode]);

  return (
    <>
      <div className="flex flex-col place-items-center pt-2 w-full">
        <div className="flex flex-row py-1 justify-between w-full pb-4">
          <Typography>General Education</Typography>
        </div>
        <PieChart
          tooltip={{
            trigger: "item",
            itemContent: (params) => {
              const ge =
                params.series.data[
                  params.itemData.dataIndex
                ].label.toLowerCase();
              const coursesWithGE = mapOfGeToCourses.get(ge);

              return (
                <div className="p-1 bg-white rounded-md shadow-md">
                  {coursesWithGE ? (
                    coursesWithGE.map((course, index) => (
                      <div key={index}>{course}</div>
                    ))
                  ) : (
                    <div>None</div>
                  )}
                </div>
              );
            },
          }}
          series={[
            {
              data,
              arcLabel: (item) => `${item.label}`,
              arcLabelMinAngle: 10,
              innerRadius: 40,
              outerRadius: 80,
              paddingAngle: 1.5,
              cornerRadius: 5,
              startAngle: 0,
              endAngle: 360,
              cx: 100,
              cy: 75,
            },
          ]}
          sx={{
            [`& .${pieArcLabelClasses.root}`]: {
              fontSize: "0.8rem",
            },
          }}
          width={220}
          height={180}
          slotProps={{
            legend: {
              hidden: true,
            },
          }}
        />
      </div>
    </>
  );
};

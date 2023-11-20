import { Typography } from "@mui/joy";
import { useEffect, useState } from "react";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { green, grey } from "@mui/material/colors";

const satisfied = green[500];
const notSatisfied = grey[400];

export const GEProgress = ({ ge }: { ge: string[] }) => {
  const [data, setData] = useState([
    { value: 10, label: "CC", color: "grey" },
    { value: 10, label: "ER", color: "grey" },
    { value: 10, label: "IM", color: "grey" },
    { value: 10, label: "MF", color: "grey" },
    { value: 10, label: "SI", color: "grey" },
    { value: 10, label: "SR", color: "grey" },
    { value: 10, label: "TA", color: "grey" },
    { value: 10, label: "PE", color: "grey" },
    { value: 10, label: "PR", color: "grey" },
    { value: 10, label: "C", color: "grey" },
  ]);

  const PE_GE = ["peT", "peH", "peE"];
  const PR_GE = ["prC", "prE", "prS"];

  // Update the color of the pie slices when "ge" prop changes
  useEffect(() => {
    setData((currData) =>
      currData.map((item) => ({
        ...item,
        color:
          // If GE is satisfied, set the corresponding GE pie section to green, else set it to grey
          (item.label === "PE" && PE_GE.some((g) => ge.includes(g))) ||
          (item.label === "PR" && PR_GE.some((g) => ge.includes(g))) ||
          ge.includes(item.label.toLowerCase())
            ? satisfied
            : notSatisfied,
      })),
    );
  }, [ge]);

  return (
    <>
      <div className="flex flex-col place-items-center xl:w-64">
        <PieChart
          tooltip={{ trigger: "none" }}
          series={[
            {
              arcLabel: (item) => `${item.label}`,
              arcLabelMinAngle: 10,
              data,
              innerRadius: 40,
              outerRadius: 80,
              paddingAngle: 0,
              cornerRadius: 5,
              startAngle: 0,
              endAngle: 360,
              cx: 100,
              cy: 75,
            },
          ]}
          sx={{
            [`& .${pieArcLabelClasses.root}`]: {
              fill: "black",
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
        <Typography className="text-sm text-center">
          You must satisfy all general education requirements to graduate.
        </Typography>
      </div>
    </>
  );
};

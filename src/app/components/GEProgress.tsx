import { CssVarsProvider, Tooltip, Typography, useColorScheme } from "@mui/joy";
import { useEffect, useState } from "react";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { blue, grey } from "@mui/material/colors";
import InfoIcon from "@mui/icons-material/Info";

const satisfied = blue[200];
const satisfiedDark = blue[800];
const notSatisfied = grey[300];
const notSatisfiedDark = grey[700];

const GEProgressModal = ({ ge }: { ge: string[] }) => {
  const { systemMode } = useColorScheme();

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
            ? systemMode == "light"
              ? satisfied
              : satisfiedDark
            : systemMode == "light"
            ? notSatisfied
            : notSatisfiedDark,
      })),
    );
  }, [ge, systemMode]);

  return (
    <>
      <div className="flex flex-col place-items-center pt-2 w-full">
        <div className="flex flex-row py-1 justify-between w-full pb-4">
          <Typography>GE Progress</Typography>
          <Tooltip
            title="You must satisfy all general education requirements to graduate"
            size="sm"
          >
            <InfoIcon sx={{ color: "gray" }} />
          </Tooltip>
        </div>
        <PieChart
          tooltip={{ trigger: "none" }}
          series={[
            {
              arcLabel: (item) => `${item.label}`,
              arcLabelMinAngle: 10,
              data,
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
      </div>
    </>
  );
};

export const GEProgress = ({ ge }: { ge: string[] }) => {
  return (
    <CssVarsProvider defaultMode="system">
      <GEProgressModal ge={ge} />
    </CssVarsProvider>
  );
};

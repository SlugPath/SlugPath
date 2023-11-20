import { useEffect, useState } from "react";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { mangoFusionPalette } from "@mui/x-charts";

export const GEProgress = ({ ge }: { ge: string[] }) => {
  const [pieAngle, setPieAngle] = useState(360);

  const [data, setData] = useState([
    { value: 0, label: "CC" },
    { value: 0, label: "ER" },
    { value: 0, label: "IM" },
    { value: 0, label: "MF" },
    { value: 0, label: "SI" },
    { value: 0, label: "SR" },
    { value: 0, label: "TA" },
    { value: 0, label: "PE" },
    { value: 0, label: "PR" },
    { value: 0, label: "C" },
    { value: 100, label: "GEs", color: "grey" },
  ]);

  const PE_GE = ["peT", "peH", "peE"];
  const PR_GE = ["prC", "prE", "prS"];

  // Update the pie data values when the ge prop changes
  useEffect(() => {
    ge.map((item) => console.log("ge", item));
    data.map((item) => console.log("pie data", item));

    setData((currData) =>
      currData.map((item) => ({
        ...item,
        value:
          // If ge props list includes the label, set the corresponding  value to 10, else set it to 0
          (item.label === "PE" && PE_GE.some((g) => ge.includes(g))) ||
          (item.label === "PR" && PR_GE.some((g) => ge.includes(g))) ||
          ge.includes(item.label.toLowerCase())
            ? 10
            : 0,
      })),
    );

    // If there are no GEs, set the GE label value to 100 to fill up the entire pie graph
    if (ge.length === 0) {
      setData(
        (currData) =>
          currData.map((item) =>
            item.label === "GEs" ? { ...item, value: 100 } : item,
          ),
        // currData.filter((item) => item.label === "GEs")
        // .map((item) => ({...item, value: 100}))
      );
      setPieAngle(360);
    } else {
      setPieAngle(ge.length * 36);
    }
  }, [ge]);

  return (
    <>
      <div className="">
        <PieChart
          colors={mangoFusionPalette}
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
              endAngle: pieAngle,
              cx: 130,
              cy: 75,
            },
          ]}
          sx={{
            [`& .${pieArcLabelClasses.root}`]: {
              fill: "white",
            },
          }}
          width={220}
          height={180}
          slotProps={{
            legend: {
              // position: { vertical: 'middle', horizontal: 'right' },
              // padding: 19,
              // itemMarkWidth: 12,
              // itemMarkHeight: 12,
              // itemGap: 8,
              hidden: true,
            },
          }}
        />
      </div>
    </>
  );
};

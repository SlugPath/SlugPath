import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { mangoFusionPalette } from "@mui/x-charts";

const data = [
  { value: 10, label: "CC" },
  { value: 10, label: "ER" },
  { value: 10, label: "IM" },
  { value: 10, label: "MF" },
  { value: 10, label: "SI" },
  { value: 10, label: "SR" },
  { value: 10, label: "TA" },
  { value: 10, label: "PE" },
  { value: 10, label: "PR" },
  { value: 10, label: "C" },
];

export const GEProgress = () => {
  return (
    <>
      <div className="">
        <PieChart
          colors={mangoFusionPalette}
          tooltip={{ trigger: "none" }}
          series={[
            {
              arcLabel: (item) => `${item.label}`,
              arcLabelMinAngle: 0,
              data,
              innerRadius: 40,
              outerRadius: 80,
              paddingAngle: 0,
              cornerRadius: 5,
              startAngle: 0,
              endAngle: 360,
              cx: 80,
              cy: 75,
            },
          ]}
          sx={{
            [`& .${pieArcLabelClasses.root}`]: {
              fill: "white",
            },
          }}
          width={300}
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

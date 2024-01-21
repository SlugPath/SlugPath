import { Tooltip, Typography, useColorScheme } from "@mui/joy";
import { PieChart } from "@mui/x-charts/PieChart";
import { Info } from "@mui/icons-material";
import { blue } from "@mui/material/colors";

const TOTAL_CREDITS_NEEDED = 180;

export const GradProgress = ({ credits }: { credits: number }) => {
  const { mode } = useColorScheme();

  const lightColor = blue[200];
  const darkColor = blue[600];
  const fadedLightColor = blue[50];
  const fadedDarkColor = "#172554";
  const data = [
    {
      value: credits,
      label: "",
      color: mode == "light" ? lightColor : darkColor,
    },
    {
      value: TOTAL_CREDITS_NEEDED - credits,
      label: "",
      color: mode == "light" ? fadedLightColor : fadedDarkColor,
      opacity: 0,
    },
  ];

  return (
    <>
      <div className="flex flex-col place-items-center w-full">
        <div className="flex flex-row justify-between w-full pb-4">
          <div className="col-span-4">
            <Typography>Total Credits:</Typography>
            <Typography>
              {credits} / {TOTAL_CREDITS_NEEDED}
            </Typography>
          </div>
          <Tooltip
            title="You must satisfy all general education requirements to graduate"
            size="sm"
          >
            <Info sx={{ color: "gray" }} />
          </Tooltip>
        </div>
        <PieChart
          series={[
            {
              data,
              cx: 100,
              cy: 75,
              outerRadius: 70,
              innerRadius: 50,
              startAngle: 360,
              endAngle: 0,
            },
          ]}
          slotProps={{
            legend: {
              hidden: true,
            },
          }}
          tooltip={{
            trigger: "none",
          }}
          width={220}
          height={180}
        />
      </div>
    </>
  );
};

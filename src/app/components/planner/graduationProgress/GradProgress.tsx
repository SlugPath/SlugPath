import { Tooltip, Typography } from "@mui/joy";
import { PieChart } from "@mui/x-charts/PieChart";
import { Info } from "@mui/icons-material";

const TOTAL_CREDITS_NEEDED = 180;

export const GradProgress = ({ credits }: { credits: number }) => {
  const percentage = Math.min(credits / TOTAL_CREDITS_NEEDED, 1);

  const data = [{ value: 1, label: "", color: "#93c5fd" }];

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
              endAngle: (1 - percentage) * 360,
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

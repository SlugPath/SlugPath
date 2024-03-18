import { Tooltip } from "@mui/joy";

export default function ProgressBar({
  percentage,
  progressType,
}: {
  percentage: number;
  progressType: string;
}) {
  return (
    <Tooltip
      title={
        `${Math.round(percentage)}% of ` +
        progressType +
        ` requirements completed`
      }
      variant="soft"
    >
      <div className="flex flex-row w-full h-6 rounded-md bg-blue-50 dark:bg-bg-faded-dark">
        <div
          className="rounded-md bg-blue-200 dark:bg-blue-600"
          style={{
            width: `${percentage}%`,
            transition: "width 0.25s",
          }}
        ></div>
      </div>
    </Tooltip>
  );
}

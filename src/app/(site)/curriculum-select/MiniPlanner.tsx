"use client";

import { MiniCourseCard } from "@/app/components/modals/majorsModal/majorSelection/MiniCourseCard";
import { StoredCourse } from "@/app/types/Course";
import { Typography } from "@mui/joy";
import Grid from "@mui/joy/Grid";

export default function MiniPlanner({
  plannerState,
  onSelected,
  selected,
}: {
  plannerState: any;
  onSelected: () => void;
  selected?: boolean;
}) {
  return (
    <button
      onClick={() => onSelected()}
      className="bg-slate-50 p-4 border-4 border-gray-300 rounded-2xl relative"
    >
      <Grid
        container
        spacing={2}
        sx={{
          flexGrow: 1,
        }}
      >
        <QuarterLabels />
        {Array.from({ length: 4 }, (_, index) => index).map((i) => {
          const slice_val = 4 * i;
          const quarters = plannerState.quarters.slice(
            slice_val,
            slice_val + 4,
          );

          return <Year key={i} year={i} quarters={quarters} />;
        })}
      </Grid>
      <SelectedIndicator toggled={selected ? selected : false} />
    </button>
  );
}

function QuarterLabels() {
  return (
    <>
      <Grid xs={2} />
      <Grid xs={2.5}>
        <Typography color="neutral">Fall</Typography>
      </Grid>
      <Grid xs={2.5}>
        <Typography color="neutral">Winter</Typography>
      </Grid>
      <Grid xs={2.5}>
        <Typography color="neutral">Spring</Typography>
      </Grid>
      <Grid xs={2.5}>
        <Typography color="neutral">Summer</Typography>
      </Grid>
    </>
  );
}

function Year({ year, quarters }: { year: number; quarters: any[] }) {
  const style = year % 2 === 1 ? { backgroundColor: "#f3f4f6" } : {};

  return (
    <>
      <Grid xs={2}>
        <Typography color="neutral" className="text-center">
          Year {year + 1}
        </Typography>
      </Grid>
      {quarters.map((quarter, index) => (
        <Grid xs={2.5} key={index} style={style} className="space-y-1 min-h-24">
          {quarter.courses.map((course: StoredCourse, index: number) => (
            <MiniCourseCard key={index} course={course} />
          ))}
        </Grid>
      ))}
    </>
  );
}

function SelectedIndicator({ toggled }: { toggled: boolean }) {
  return (
    <div className="border-gray-300 border-4 items-center flex justify-center rounded-full transition-opacity w-8 h-8 absolute top-0 right-0 m-2 p-2">
      {toggled && <div className="bg-blue-300 rounded-full p-2" />}
    </div>
  );
}

"use client";

import { MiniCourseCard } from "@/app/components/modals/majorsModal/majorSelection/MiniCourseCard";
import { StoredCourse } from "@/app/types/Course";
import { Divider, Typography } from "@mui/joy";
import Grid from "@mui/joy/Grid";

export default function MiniPlanner({ plannerState }: { plannerState: any }) {
  return (
    <div className="bg-slate-50 p-4 border-4 border-gray-300 rounded-2xl">
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
    </div>
  );
}

function QuarterLabels() {
  return (
    <>
      <Grid xs={2} />
      <Grid xs={2.5}>
        <Typography color="neutral">Fall</Typography>
      </Grid>
      <Divider orientation="vertical" sx={{ mr: "-1px" }} className="mt-3" />
      <Grid xs={2.5}>
        <Typography color="neutral">Winter</Typography>
      </Grid>
      <Divider orientation="vertical" sx={{ mr: "-1px" }} className="mt-3" />
      <Grid xs={2.5}>
        <Typography color="neutral">Spring</Typography>
      </Grid>
      <Divider orientation="vertical" sx={{ mr: "-1px" }} className="mt-3" />
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
        <Grid xs={2.5} key={index} style={style} className="space-y-1">
          {quarter.courses.map((course: StoredCourse, index: number) => (
            <MiniCourseCard key={index} course={course} />
          ))}
          <Divider orientation="vertical" sx={{ mr: "-1px" }} />
        </Grid>
      ))}
    </>
  );
}

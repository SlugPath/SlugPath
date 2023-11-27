import { Typography } from "@mui/joy";
import MajorSelection from "../components/MajorSelection";

export default function Page() {
  return (
    <div className="bg-slate-200 h-full min-h-screen">
      <Typography level="h1" className="text-center pt-5">
        Welcome to the UCSC Course Planner!
      </Typography>
      <div className="flex flex-col items-center justify-center h-[80vh] w-[33vw] mx-auto">
        <MajorSelection />
      </div>
    </div>
  );
}

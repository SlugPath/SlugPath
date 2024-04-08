"use client";

import { MiniCourseCard } from "@/app/components/modals/majorsModal/majorSelection/MiniCourseCard";
import { StoredCourse } from "@/app/types/Course";

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
      <div className="grid grid-cols-9">
        <QuarterLabels />
        {Array.from({ length: 4 }, (_, index) => index).map((i) => {
          const slice_val = 4 * i;
          const quarters = plannerState.quarters.slice(
            slice_val,
            slice_val + 4,
          );

          return <Year key={i} year={i} quarters={quarters} />;
        })}
      </div>
      <SelectedIndicator toggled={selected ? selected : false} />
    </button>
  );
}

function QuarterLabels() {
  return (
    <>
      <div className="col-span-1" />
      <div className="col-span-2">
        <div className="text-gray-500 text-left ml-2">Fall</div>
      </div>
      <div className="col-span-2">
        <div className="text-gray-500 text-left ml-2">Winter</div>
      </div>
      <div className="col-span-2">
        <div className="text-gray-500 text-left ml-2">Spring</div>
      </div>
      <div className="col-span-2">
        <div className="text-gray-500 text-left ml-2">Summer</div>
      </div>
    </>
  );
}

function Year({ year, quarters }: { year: number; quarters: any[] }) {
  const style = year % 2 === 1 ? { backgroundColor: "#f3f4f6" } : {};

  return (
    <>
      <div className="col-span-1">
        <div className="text-gray-500 text-center">Year {year + 1}</div>
      </div>
      {quarters.map((quarter, index) => (
        <div key={index} style={style} className="min-h-24 col-span-2">
          <div className="space-y-1 m-2 text-left">
            {quarter.courses.map((course: StoredCourse, index: number) => (
              <MiniCourseCard key={index} course={course} />
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

function SelectedIndicator({ toggled }: { toggled: boolean }) {
  return (
    <div className="border-gray-300 bg-white border-4 items-center flex justify-center rounded-full transition-opacity w-8 h-8 absolute top-0 right-0 m-2 p-2">
      {toggled && <div className="bg-blue-300 rounded-full p-2" />}
    </div>
  );
}

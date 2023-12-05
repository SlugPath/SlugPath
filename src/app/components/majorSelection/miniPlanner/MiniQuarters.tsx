import { quartersPerYear, years } from "@/lib/plannerUtils";
import { PlannerData, findCoursesInQuarter } from "../../../types/PlannerData";
import { StoredCourse } from "../../../types/Course";
import { Quarter } from "../../../types/Quarter";
import MiniQuarterCard from "../MiniQuarterCard";

export default function MiniQuarters({
  courseState,
}: {
  courseState: PlannerData;
}) {
  const quartersAndTerms: QuarterYearTerm[] = getQuartersAndTerms(years);

  return (
    <>
      {Array.from({ length: quartersPerYear }, (_, index) => index).map((i) => {
        const slice_val = quartersPerYear * i;
        const quarters = quartersAndTerms.slice(
          slice_val,
          slice_val + quartersPerYear,
        );
        return (
          <div key={i} className="flex flex-row space-x-2">
            {quarters.map((quarterYearTerm: QuarterYearTerm, index: number) => {
              const quarter = findQuarterInCourseState(
                quarterYearTerm.year,
                quarterYearTerm.term,
                courseState,
              );

              if (quarter === undefined) {
                const emptyQuarter = {
                  id: `quarter-${quarterYearTerm.year + 1}-${
                    quarterYearTerm.term
                  }`,
                  title: `Year ${quarterYearTerm.year + 1}: ${
                    quarterYearTerm.term
                  }`,
                  courses: [],
                };

                return (
                  <MiniQuarterCard
                    key={index}
                    quarter={emptyQuarter}
                    courses={emptyQuarter.courses}
                  />
                );
              }

              const courses: StoredCourse[] = findCoursesInQuarter(
                courseState,
                quarter.id,
              );

              return (
                <MiniQuarterCard
                  key={index}
                  quarter={quarter}
                  courses={courses}
                />
              );
            })}
          </div>
        );
      })}
    </>
  );
}

function findQuarterInCourseState(
  year: number,
  term: string,
  courseState: PlannerData,
): Quarter | undefined {
  return courseState.quarters.find((quarter) => {
    const [quarterYear, quarterTerm] = quarter.id.split("-").slice(1);
    return year == parseInt(quarterYear) && term == quarterTerm;
  });
}

interface QuarterYearTerm {
  year: number;
  term: string;
}

function getQuartersAndTerms(years: number): QuarterYearTerm[] {
  const quarters = [];
  for (let year = 0; year < years; year++) {
    const terms = ["Fall", "Winter", "Spring", "Summer"];
    for (const term of terms) {
      quarters.push({
        year: year,
        term: term,
      });
    }
  }
  return quarters;
}

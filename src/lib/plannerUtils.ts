import { Quarter } from "../app/types/Quarter";
import { PlannerData, findCourseById } from "../app/types/PlannerData";
import {
  PlannerDataInput,
  QuarterInput,
  PlannerData as PlannerDataOutput,
} from "@/graphql/planner/schema";

const quarterNames = ["Summer", "Fall", "Winter", "Spring"];
const years = 4;
export const quartersPerYear = 4;

export const initialPlanner: PlannerData = {
  quarters: createQuarters(),
  years,
  courseTable: {},
};

export const emptyPlanner: PlannerData = {
  quarters: [],
  years,
  courseTable: {},
};

export function createQuarters() {
  const quarters: Quarter[] = [];

  for (let year = 0; year < years; year++) {
    for (let quarter = 0; quarter < quartersPerYear; quarter++) {
      const id = `quarter-${year}-${quarterNames[quarter]}`;
      quarters.push({
        id,
        title: `Year ${year + 1}: ${quarterNames[quarter]}`,
        courses: [],
      });
    }
  }

  return quarters;
}

export function serializePlanner(courseState: PlannerData): PlannerDataInput {
  const result: PlannerDataInput = {
    years: courseState.years,
    quarters: [],
  };

  courseState.quarters.forEach((q) => {
    const quarter: QuarterInput = {
      id: q.id,
      title: q.title,
      courses: q.courses.map((cid) => {
        return {
          id: cid,
          ...findCourseById(courseState, cid),
        };
      }),
    };
    result.quarters.push(quarter);
  });

  return result;
}

export function deserializePlanner(output: PlannerDataOutput): PlannerData {
  const result: PlannerData = {
    years: output.years,
    quarters: [],
    courseTable: {},
  };

  output.quarters.forEach((q) => {
    const quarter: Quarter = {
      title: q.title,
      id: q.id,
      courses: [],
    };
    q.courses.forEach((c) => {
      const { id, ...rest } = c;
      result.courseTable[id] = rest;
      quarter.courses.push(id);
    });
    result.quarters.push(quarter);
  });

  return result;
}

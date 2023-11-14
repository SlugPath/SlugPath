import { Quarter } from "../app/types/Quarter";
import { PlannerData } from "../app/types/PlannerData";

const quarterNames = ["Summer", "Fall", "Winter", "Spring"];
const years = 4;
export const quartersPerYear = 4;

export const initialPlanner: PlannerData = {
  quarters: createQuarters(),
  years,
};

export const emptyPlanner: PlannerData = {
  quarters: [],
  years,
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

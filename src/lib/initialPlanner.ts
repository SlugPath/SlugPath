import { Quarter } from "../app/ts-types/Quarter";
import { PlannerData } from "../app/ts-types/PlannerData";

const quarterNames = ["Fall", "Winter", "Spring", "Summer"];
const years = 4;
export const quartersPerYear = 4;

export const initialPlanner = (title: string): PlannerData => ({
  title,
  quarters: createQuarters().quarters,
  quarterOrder: createQuarters().quarterOrder,
  years,
  quartersPerYear,
});

export function createQuarters() {
  const quarters: Quarter[] = [];
  const quarterOrder: string[] = [];

  for (let year = 0; year < years; year++) {
    for (let quarter = 0; quarter < quartersPerYear; quarter++) {
      const id = `quarter-${year}-${quarterNames[quarter]}`;
      quarters.push({
        id,
        title: `Year ${year + 1}: ${quarterNames[quarter]}`,
        courses: [],
      });
      quarterOrder.push(id);
    }
  }

  return { quarters, quarterOrder };
}

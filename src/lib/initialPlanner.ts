import { Quarter } from "../app/ts-types/Quarter";
import { PlannerData } from "../app/ts-types/PlannerData";

const quarterNames = ["Fall", "Winter", "Spring", "Summer"];
const yearNames = ["Freshman", "Sophomore", "Junior", "Senior"];
const years = 4;
const quartersPerYear = 4;

export const initialPlanner: PlannerData = {
  quarters: createQuarters().quarters,
  quarterOrder: createQuarters().quarterOrder,
  years,
  quartersPerYear,
};

function createQuarters() {
  const quarters: { [key: string]: Quarter } = {};
  const quarterOrder: string[] = [];

  for (let year = 0; year < years; year++) {
    for (let quarter = 0; quarter < quartersPerYear; quarter++) {
      const quarterId = `quarter-${year}-${quarter}`;
      quarters[quarterId] = {
        id: quarterId,
        title: `${quarterNames[quarter]} ${yearNames[year]}`,
        courses: [],
      };
      quarterOrder.push(quarterId);
    }
  }

  return { quarters, quarterOrder };
}

import { Quarter } from "../app/ts-types/Quarter";
import { PlannerData } from "../app/ts-types/PlannerData";

const quarterNames = ["FALL", "WINTER", "SPRING", "SUMMER"];
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
      const quarterId = `quarter-${year}-${quarterNames[quarter]}`;
      quarters[quarterId] = {
        id: quarterId,
        title: `${quarterNames[quarter]} ${year}`,
        courses: [],
      };
      quarterOrder.push(quarterId);
    }
  }

  return { quarters, quarterOrder };
}

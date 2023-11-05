import { Quarter } from "./Quarter";

/**
 * `PlannerData` is a placeholder type used to store courses, quarters, and other fields
 */
export interface PlannerData {
  quarters: { [key: string]: Quarter };
  quarterOrder: string[];
  years: number;
  quartersPerYear: number;
}

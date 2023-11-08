import { Quarter } from "./Quarter";

/**
 * `PlannerData` is a placeholder type used to store courses, quarters, and other fields
 */
export interface PlannerData {
  title: string;
  quarters: Quarter[];
  quarterOrder: string[];
  years: number;
  quartersPerYear: number;
}

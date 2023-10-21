import { DummyCourse } from "./Course";
import { Quarter } from "./Quarter";

/**
 * `DummyData` is a placeholder type used to store courses, quarters, and other fields
 */
export interface DummyData {
  courses: { [key: string]: DummyCourse };
  quarters: { [key: string]: Quarter };
  quarterOrder: string[];
  years: number;
  quartersPerYear: number;
}

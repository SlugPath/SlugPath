import { DummyCourse } from "./Course";
import { Quarter } from "./Quarter";

export interface DummyData {
  courses: { [key: string]: DummyCourse };
  quarters: { [key: string]: Quarter };
  quarterOrder: string[];
  years: number;
  quartersPerYear: number;
}

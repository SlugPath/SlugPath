/**
 * `Quarter` is a composite type that contains ids of multiple courses a student might take in a quarter
 */
export interface Quarter {
  year: number;
  title: Term;
  courses: string[];
}

export type Term = "Fall" | "Winter" | "Spring" | "Summer";

import { ProgramType } from "@prisma/client";

export type Major = {
  id: number;
  programType: "Major";
  name: string;
  catalogYear: string;
};

export type Minor = {
  id: number;
  programType: "Minor";
  name: string;
  catalogYear: string;
};

export type Program = Major | Minor;

export type ProgramInput = {
  name: string;
  catalogYear: string;
  programType: ProgramType;
};

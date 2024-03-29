import { ProgramType } from "@prisma/client";

export type Program = {
  id: number;
  name: string;
  catalogYear: string;
  programType: ProgramType;
};

export type ProgramInput = {
  name: string;
  catalogYear: string;
  programType: ProgramType;
};

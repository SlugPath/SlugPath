import { ProgramType } from "@prisma/client";

export interface Program {
  name: string;
  id: number;
  catalogYear: string;
  programType: ProgramType;
}

export type ProgramInput = {
  name: string;
  catalogYear: string;
  programType: ProgramType;
};

export type ProgramInfo = {
  programName: string;
  catalogYear: string;
};

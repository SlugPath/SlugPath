import { ProgramType } from "@prisma/client";

export interface Major {
  name: string;
  id: number;
  catalogYear: string;
  programType: ProgramType;
}

export type MajorInput = {
  name: string;
  catalogYear: string;
  programType: ProgramType;
};

import { ProgramType } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

import { getPrograms, getProgramsByTypeInYear } from "../actions/major";

/**
 * A React Query hook to get all majors
 * @returns React Query useQuery Hook for all majors
 */
export function usePrograms() {
  return useQuery({
    queryKey: ["programs"],
    queryFn: async () => {
      return await getPrograms();
    },
  });
}

/**
 * A React Query hook to get degree programs of a specified program type (major or minor) for a specific catalog year
 * @param programType Major or Minor
 * @param catalogYear Year of selected catalog
 * @returns React Query useQuery Hook for degree programs
 */
export function useProgramTypeOfYear(
  programType: ProgramType,
  catalogYear: string,
) {
  return useQuery({
    queryKey: ["programs", programType, catalogYear],
    queryFn: async () => {
      return await getProgramsByTypeInYear(programType, catalogYear);
    },
    enabled: catalogYear !== "" && programType in ProgramType,
  });
}

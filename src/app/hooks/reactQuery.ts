import { filterRedundantPrograms } from "@/lib/utils";
import { ProgramType } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

import {
  getPrograms,
  getProgramsByTypeInYear,
  getUserProgramsById,
} from "../actions/program";

/**
 * A React Query hook to get all majors and minors
 * @returns React Query useQuery Hook for all majors and minors
 */
export function usePrograms() {
  return useQuery({
    queryKey: ["allPrograms"],
    queryFn: async () => await getPrograms(),
    initialData: [],
  });
}

/**
 * A React Query hook to get all unique majors and minors
 * @returns React Query useQuery Hook for all majors and minors
 */
export function useUnqiuePrograms() {
  return useQuery({
    queryKey: ["allUniquePrograms"],
    queryFn: async () => {
      const res = await getPrograms();
      return filterRedundantPrograms(res);
    },
    initialData: [],
  });
}

/**
 * A React Query hook to get all majors and minors for a user by their user id
 * @params userId a unique id that identifies a user
 */
export function useUserPrograms(userId: string) {
  return useQuery({
    queryKey: ["userPrograms", userId],
    queryFn: async () => await getUserProgramsById(userId),
    enabled: !!userId,
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

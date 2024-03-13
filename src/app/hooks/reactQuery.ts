import { EMPTY_PLANNER, initialPlanner } from "@/lib/plannerUtils";
import { filterRedundantPrograms } from "@/lib/utils";
import { ProgramType } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getPlannerById } from "../actions/planner";
import {
  getProgramDefaultPlanners,
  getPrograms,
  getProgramsByTypeInYear,
  getUserDefaultPlannerId,
  getUserPrimaryProgram,
  getUserProgramsById,
  saveUserPrograms,
  updateUserDefaultPlanner,
} from "../actions/program";
import { Program, ProgramInput } from "../types/Program";

/**
 * A React Query hook to fetch all majors and minors
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
 * A React Query hook to fetch all unique majors and minors
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
 * A React Query hook to fetch degree programs of a specified program type (major or minor) for a specific catalog year
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
    initialData: [],
    enabled: catalogYear !== "" && programType in ProgramType,
  });
}
/**
 * A React Query hook to fetch all majors and minors for a user by their user id
 * @param userId unique id that identifies a user
 * @returns React Query useQuery Hook for all majors and minors for a user
 */
export function useUserPrograms(userId: string | undefined) {
  return useQuery({
    queryKey: ["userPrograms", userId],
    queryFn: async () => await getUserProgramsById(userId!),
    initialData: [],
    enabled: userId !== undefined,
  });
}

/**
 * A React Query hook to fetch a user's primary major
 * @param userId unique id that identifies a user
 * @returns React Query useQuery Hook for a user's primary major
 */
export function useUserPrimaryProgram(userId: string | undefined) {
  return useQuery({
    queryKey: ["userPrimaryProgram", userId],
    queryFn: async () => await getUserPrimaryProgram(userId!),
    initialData: null,
    enabled: userId !== undefined,
  });
}

/**
 * A React Query hook to save user programs
 * @param userId unique id that identifies a user
 * @returns React Query useMutation Hook for saving user programs
 */
export function useSaveUserPrograms() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["savePrograms"], // QUESTION: needs userId? Necessary at all?
    mutationFn: async (params: { userId: string; programs: ProgramInput[] }) =>
      await saveUserPrograms(params),
    onSuccess: (_, { userId }) => {
      queryClient.refetchQueries({ queryKey: ["userMajors", userId] });

      // NOTE: need to refetch the primary major because it might be null now
      // if we deleted the current primary major and we need to reflect that in the UI
      queryClient.refetchQueries({ queryKey: ["userPrimaryMajor", userId] });
    },
  });
}

/**
 * A React Query hook to fetch a planner by its id
 * @param plannerId unique id that identifies a planner
 * @returns React Query useQuery Hook for a planner
 */
export function usePlanner(plannerId: string) {
  return useQuery({
    queryKey: ["getPlanner", plannerId],
    queryFn: async () => await getPlannerById(plannerId),
    placeholderData: initialPlanner(),
    enabled: !!plannerId && plannerId !== EMPTY_PLANNER,
  });
}

/**
 * A React Query hook to fetch a user's default planner id
 * @param userId unique id that identifies a user
 * @returns React Query useQuery Hook for a user's default planner id
 */
export function useUserDefaultPlannerId(userId: string | undefined) {
  return useQuery({
    queryKey: ["userDefaultPlannerId", userId],
    queryFn: async () => {
      return await getUserDefaultPlannerId(userId!);
    },
    initialData: undefined,
    enabled: !!userId,
  });
}

/**
 * A React Query hook to update a user's default planner id
 * @param userId unique id that identifies a user
 * @param plannerId unique id that identifies a planner
 * @returns React Query useMutation Hook for updating a user's default planner id
 */
export function useUpdateUserDefaultPlannerId() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateUserDefaultPlannerId"],
    mutationFn: async (params: {
      userId: string;
      defaultPlannerId: string;
    }) => {
      await updateUserDefaultPlanner(params);
    },
    onSuccess: (_, { userId }) => {
      queryClient.refetchQueries({
        queryKey: ["userDefaultPlannerId", userId],
      });
      queryClient.refetchQueries({ queryKey: ["userDefaultPlanner", userId] });
      queryClient.refetchQueries({ queryKey: ["userPrimaryProgram", userId] });
    },
  });
}

/**
 * A React Query hook to fetch a user's default planner
 * @param userId unique id that identifies a user
 * @returns React Query useQuery Hook for a user's default planner
 */
export function useUserDefaultPlanner(userId: string | undefined) {
  const queryClient = useQueryClient();

  const defaultPlannerId: string | undefined = queryClient.getQueryData([
    "userDefaultPlannerId",
    userId,
  ]);

  return useQuery({
    queryKey: ["userDefaultPlanner", defaultPlannerId],
    queryFn: async () => {
      const defaultPlanner = await getPlannerById(defaultPlannerId!);
      return defaultPlanner ?? initialPlanner(); // QUESTION: is this correct?
    },
    placeholderData: initialPlanner(),
    enabled: !!defaultPlannerId && !!userId,
  });
}

/**
 * A React Query hook to fetch a user's default planner id
 * @param userId unique id that identifies a user
 * @param primaryProgram user's primary program
 * @returns React Query useQuery Hook for a user's default planner id
 */
export function useUserProgramDefaultPlanners(
  userId: string | undefined,
  primaryProgram: Program | undefined | null,
) {
  return useQuery({
    queryKey: ["userProgramDefaultPlanners", userId, primaryProgram],
    queryFn: async () =>
      await getProgramDefaultPlanners({
        userId: userId!,
        program: primaryProgram!,
      }),
    // TODO: set defaultPlannerId to the first default planner id of the
    // newly selected primary major if it hasn't been already (old code below)

    // onSuccess: (data) => {
    //   const ids = data.map((p) => p.id);
    //   if (defaultPlannerId && !ids.includes(defaultPlannerId))
    //     setDefaultPlannerId(res[0]?.id);
    //   }
    // },
    enabled: !!userId && !!primaryProgram,
  });
}

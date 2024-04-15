import { EMPTY_PLANNER_ID, initializeNewPlanner } from "@/lib/plannerUtils";
import { filterRedundantPrograms } from "@/lib/utils";
import { ProgramType } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getCourse, getSuggestedCourses } from "../actions/course";
import {
  removePermission as deletePermission,
  getPermissions,
  getUserPermissions,
  getUserRole,
  replacePermission,
} from "../actions/permissions";
import {
  getPlannerById,
  getUserPlanners,
  updateUserPlanners,
} from "../actions/planner";
import {
  getProgramDefaultPlanners,
  getPrograms,
  getProgramsByTypeInYear,
  getUserDefaultPlannerId,
  getUserPrimaryProgram,
  getUserProgramsById,
  updateUserDefaultPlanner,
  updateUserPrograms,
} from "../actions/program";
import { Permission } from "../types/Permission";
import { PlannerData } from "../types/Planner";
import { Program, ProgramInput } from "../types/Program";

/**
 * A React Query hook to fetch all majors and minors
 * @returns React Query useQuery Hook for all majors and minors
 */
export function usePrograms() {
  return useQuery({
    queryKey: ["allPrograms"],
    queryFn: async () => await getPrograms(),
    placeholderData: [],
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
    placeholderData: [],
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
      console.log("fetching programs", programType, catalogYear);
      return await getProgramsByTypeInYear(programType, catalogYear);
    },
    placeholderData: [],
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
    placeholderData: [],
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
    placeholderData: null,
    enabled: !!userId,
  });
}

/**
 * A React Query hook to save user programs
 * @param userId unique id that identifies a user
 * @returns React Query useMutation Hook for saving user programs
 */
export function useUpdateUserProgramsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { userId: string; programs: ProgramInput[] }) =>
      await updateUserPrograms(params),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["userPrograms", userId] });

      // NOTE: userPrimaryProgram may change after saving programs
      queryClient.invalidateQueries({
        queryKey: ["userPrimaryProgram", userId],
      });
    },
  });
}

/**
 * A React Query hook to fetch all planners
 * @param email user email
 * @returns React Query useQuery Hook for all planners
 */
export function usePlanners(userId: string | undefined) {
  return useQuery({
    queryKey: ["planners", userId],
    queryFn: async () => await getUserPlanners(userId!),
    refetchInterval: 1000 * 180,
    staleTime: 1000 * 90,
    placeholderData: [],
    throwOnError: true,
    refetchOnMount: false,
    enabled: !!userId,
  });
}

/**
 * A React Query hook to update all user planners
 * @returns React Query useMutation Hook for updating all user planners
 */
export function useUpdatePlannersMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { userId: string; planners: PlannerData[] }) =>
      await updateUserPlanners(params),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["planners", userId] });
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
    placeholderData: initializeNewPlanner(),
    enabled: !!plannerId && plannerId !== EMPTY_PLANNER_ID,
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
    placeholderData: undefined,
    enabled: !!userId,
  });
}

/**
 * A React Query hook to update a user's default planner id
 * @param userId unique id that identifies a user
 * @param plannerId unique id that identifies a planner
 * @returns React Query useMutation Hook for updating a user's default planner id
 */
export function useUpdateUserDefaultPlannerIdMutation() {
  const queryClient = useQueryClient();

  return useMutation({
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
      return defaultPlanner ?? initializeNewPlanner(); // QUESTION: is this correct?
    },
    placeholderData: initializeNewPlanner(),
    enabled: !!defaultPlannerId && !!userId,
  });
}

/**
 * A React Query hook to fetch a user's default planners for a specified program
 * @param userId unique id that identifies a user
 * @param program one of user's programs to fetch default planners for
 * @returns React Query useQuery Hook for a user's default planner id
 */
export function useUserProgramDefaultPlanners(
  userId: string | undefined,
  program: Program | undefined | null,
) {
  return useQuery({
    queryKey: ["userProgramDefaultPlanners", userId, program],
    queryFn: async () => {
      const planners = await getProgramDefaultPlanners({
        userId: userId!,
        program: program!,
      });

      return planners;
    },
    enabled: !!userId && !!program,
  });
}

/**
 * A React Query hook to fetch permissions for all users
 * @returns React Query useQuery Hook for user permissions
 */
export function usePermissions(
  select?: (Permission: Permission[]) => Permission[],
) {
  return useQuery({
    queryKey: ["permissions"],
    queryFn: async () => await getPermissions(),
    placeholderData: [],
    select,
  });
}

/**
 * A React Query hook to update a user's permissions in the database
 * @returns React Query useMutation Hook for updating user permissions
 */
export function useUpdateUserPermissionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { userId: string; permission: Permission }) =>
      await replacePermission(params),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({
        queryKey: ["userPermissions", userId],
      });
      queryClient.invalidateQueries({
        queryKey: ["permissions"],
      });
    },
  });
}

/**
 * A React Query hook to delete a user's permissions in the database
 * @returns React Query useMutation Hook for deleting user permissions
 */
export function useDeleteUserPermissionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { userId: string; userEmail: string }) =>
      await deletePermission(params),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({
        queryKey: ["userPermissions", userId],
      });
      queryClient.invalidateQueries({
        queryKey: ["permissions"],
      });
    },
  });
}

/**
 * A React Query hook to fetch a user's permissions
 * @param userId unique id that identifies a user
 * @param select function to filter data from the query
 * @returns React Query useQuery Hook for user permissions
 */
export function useUserPermissions(userId: string | undefined) {
  return useQuery({
    queryKey: ["userPermissions", userId],
    queryFn: async () => await getUserPermissions(userId!),
    enabled: !!userId,
  });
}

/**
 * A React Query hook to fetch a user's role
 * @returns React Query useQuery Hook for user role
 */
export function useUserRole(userId: string | undefined) {
  return useQuery({
    queryKey: ["userRole", userId],
    queryFn: async () => await getUserRole(userId!),
    enabled: !!userId,
  });
}

/**
 * A React Query hook to fetch information on a course
 * @param departmentCode Department code of the course
 * @param courseNumber Course number
 */
export function useCourse(
  departmentCode: string | undefined,
  courseNumber: string | undefined,
) {
  return useQuery({
    queryKey: ["course", departmentCode, courseNumber],
    queryFn: async () => {
      return await getCourse({
        departmentCode,
        number: courseNumber,
      });
    },
    placeholderData: undefined,
    enabled:
      !!departmentCode &&
      departmentCode !== "" &&
      !!courseNumber &&
      courseNumber !== "",
    staleTime: Infinity, // Course info is static
  });
}

/**
 * A React Query hook to fetch suggested courses based on course titles
 * @param titles Course titles to get suggested classes for
 * @returns React Query useQuery Hook for courses that match the specified titles
 */
export function useSuggestedCourses(titles: string[]) {
  return useQuery({
    queryKey: ["suggestedCourses", titles],
    queryFn: async () => await getSuggestedCourses(titles),
    enabled: titles.length > 0,
  });
}

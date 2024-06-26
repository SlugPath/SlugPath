import {
  EMPTY_PLANNER,
  cloneDefaultPlanner,
  initialPlanner,
  isOfficialCourse,
} from "@/lib/plannerUtils";
import { filterRedundantPrograms } from "@/lib/utils";
import {
  getCourse,
  getSuggestedCourses,
  getTransferEquivalents,
} from "@actions/course";
import { getEnrollmentInfo } from "@actions/enrollment";
import {
  removePermission as deletePermission,
  getPermissions,
  getUserPermissions,
  getUserRole,
  replacePermission,
} from "@actions/permissions";
import {
  getPlannerById,
  getPlannersByProgram,
  getUserPlanners,
  updateUserPlanners,
} from "@actions/planner";
import {
  getCatalogYears,
  getProgram,
  getProgramDefaultPlanners,
  getPrograms,
  getProgramsByTypeInYear,
  getUserProgramsById,
  updateUserPrograms,
} from "@actions/program";
import { ProgramType } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";

import { StoredCourse } from "../types/Course";
import { Permission } from "../types/Permission";
import { PlannerData } from "../types/Planner";
import { Program, ProgramInput } from "../types/Program";

/**
 * A React Query hook to fetch all majors and minors, optionally for a specific
 * catalog year
 * @param catalogYear (optional) Year of selected catalog
 * @returns React Query useQuery Hook for all majors and minors
 */
export function usePrograms(catalogYear?: string) {
  return useQuery({
    queryKey: ["programs", catalogYear],
    queryFn: async () => await getPrograms(catalogYear),
    placeholderData: [],
    staleTime: Infinity, // Programs are static
    refetchOnMount: false,
  });
}

/**
 * A React Query hook to fetch a specific program by its id
 * @param programId unique id that identifies a program
 * @returns React Query useQuery Hook for a program
 */
export function useProgram(programId: number) {
  return useQuery({
    queryKey: ["program", programId],
    queryFn: async () => await getProgram(programId),
    placeholderData: null,
    enabled: !!programId,
  });
}

/**
 * A React Query hook to fetch all unique majors and minors, optionally for a
 * specific catalog year
 * @param catalogYear (optional) Year of selected catalog
 * @returns React Query useQuery Hook for all majors and minors
 */
export function useUniquePrograms(catalogYear?: string) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["uniquePrograms", catalogYear],
    queryFn: async () => await getPrograms(catalogYear, true),
    // Use cache to avoid refetching data
    initialData: () => {
      const programs: Program[] | undefined = queryClient.getQueryData([
        "programs",
        catalogYear,
      ]);
      return programs ? filterRedundantPrograms(programs) : [];
    },
    placeholderData: [],
    staleTime: Infinity, // Programs are static
    refetchOnMount: false,
  });
}

/**
 * A React Query hook to fetch equivalent transfer courses for a specified course at UCSC.
 * @param course UCSC course
 * @returns React Query useQuery Hook for transfer courses
 */
export function useTransferCourses(course: StoredCourse) {
  return useQuery({
    queryKey: ["transferCourses", course.departmentCode, course.number],
    queryFn: async () => await getTransferEquivalents(course),
    staleTime: Infinity,
    enabled: isOfficialCourse(course),
  });
}

/**
 * A React Query hook to fetch degree programs of a specified program type
 * (major or minor) for a specific catalog year
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
    placeholderData: [],
    enabled: catalogYear !== "" && programType in ProgramType,
  });
}

/**
 * A React Query hook to fetch all catalog years, optionally for a specific
 * program
 * @param programName Name of the program
 * @returns React Query useQuery Hook for all catalog years
 */
export function useCatalogYears(programName?: string) {
  return useQuery({
    queryKey: ["years", programName],
    queryFn: async () => await getCatalogYears(programName),
    placeholderData: [],
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
 * @param userId unique id that identifies a user
 * @returns React Query useQuery Hook for all planners
 */
export function usePlanners(userId: string | undefined) {
  return useQuery({
    queryKey: ["planners", userId],
    queryFn: async () => await getUserPlanners(userId!),
    refetchInterval: 1000 * 180,
    staleTime: 1000 * 90,
    throwOnError: true,
    enabled: !!userId,
    /* adding the line 'placeholderData: []' will cause a bug where
      it seems there are no planners when in fact there are. Affects
      Planners.tsx
     */
  });
}

/**
 * A React Query hook to update all user planners
 * @returns React Query useMutation Hook for updating all user planners
 */
export function useUpdatePlannersMutation(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { userId: string; planners: PlannerData[] }) =>
      await updateUserPlanners(params),
    onSuccess: (data, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["planners", userId] });
      if (onSuccess) {
        queryClient.setQueryData(["planners", userId], data);
        onSuccess();
        console.log("Planners updated successfully");
      }
    },
  });
}

export function useAddNewPlannerMutation(
  userId: string | undefined,
  onSuccess?: () => void,
) {
  const { data: planners } = usePlanners(userId);
  const { mutate: saveAll } = useUpdatePlannersMutation(onSuccess);

  async function addNewPlanner({
    userId,
    planner,
  }: {
    userId: string | undefined;
    planner: PlannerData;
  }) {
    if (!planners) return;

    const id = uuidv4();

    const newPlanners = planners.concat({
      ...cloneDefaultPlanner(planner!),
      id,
      title: "New Planner",
    });

    await saveAll({ userId: userId!, planners: newPlanners });
  }

  return useMutation({
    mutationFn: async (params: {
      userId: string | undefined;
      planner: PlannerData;
    }) => await addNewPlanner(params),
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
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
 * A React Query hook to fetch all default planners for a program in a catalog year
 * @param programName name of the program
 * @param catalogYear year of the catalog
 * @returns React Query useQuery Hook for all default planners for a program in a catalog year
 */
export function useProgramDefaultPlanners(
  programName: string,
  catalogYear: string,
) {
  return useQuery({
    queryKey: ["programDefaultPlanners", programName, catalogYear],
    queryFn: async () => await getPlannersByProgram(programName, catalogYear),
    placeholderData: [],
    enabled: !!programName,
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

      // OLD NOTE: set defaultPlannerId to the first default planner id of the
      // newly selected primary major if it hasn't been already (old code below)

      // const ids = planners.map((p) => p.id);
      // if (defaultPlannerId && !ids.includes(defaultPlannerId))
      // queryClient.setQueryData(
      //   ["userDefaultPlannerId", userId],
      //   planners[0]?.id,
      // );
      // }
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
    // placeholderData: [],
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
export function useCourse(departmentCode: string, courseNumber: string) {
  return useQuery({
    queryKey: ["course", departmentCode, courseNumber],
    queryFn: async () => {
      return await getCourse({
        departmentCode,
        number: courseNumber,
      });
    },
    placeholderData: undefined,
    enabled: departmentCode !== "" && courseNumber !== "",
    staleTime: Infinity, // Course info is static
  });
}

/**
 * A React Query hook to fetch suggested courses for a given custom course
 * @param titles titles of the custom course to search for
 * @returns React Query useQuery Hook for courses that match the specified titles
 */

export function useSuggestedCourses(titles: string[]) {
  return useQuery({
    queryKey: ["suggestedCourses", ...titles],
    queryFn: async () => await getSuggestedCourses(titles),
    enabled: titles.length > 0,
    staleTime: Infinity,
  });
}

/**
 * A React Query hook to fetch past enrollment info for a course
 * @param course an official course to get past enrollment info for
 * @returns React Query useQuery Hook for past enrollment info
 */
export function usePastEnrollmentInfo(course: StoredCourse | undefined) {
  return useQuery({
    queryKey: ["pastEnrollmentInfo", course?.departmentCode, course?.number],
    queryFn: async () => await getEnrollmentInfo(course!),
    enabled: course !== undefined && isOfficialCourse(course),
    placeholderData: [],
    staleTime: Infinity,
  });
}

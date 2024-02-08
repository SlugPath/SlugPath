import {
  MajorInput,
  addUserMajor,
  getUserMajorsById,
  removeUserMajor,
} from "@/app/actions/major";
import { ProgramType } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/**
 *
 * @param userId a unique id that identifies a user
 * @param onCompleted a callback to invoke upon completion of a query
 * @returns
 */
export default function useMajorSelection(
  userId: string | undefined,
  onSuccess?: () => void,
) {
  // Update user major data
  const queryClient = useQueryClient();
  const {
    isPending: userMajorsIsLoading,
    // isError,
    data: userMajors,
  } = useQuery({
    queryKey: ["userMajors", userId],
    queryFn: async () => {
      return await getUserMajorsById(userId!);
    },
    enabled: !!userId,
  });

  const {
    mutate: addMajor,
    isPending: loadingAddMajor,
    isError: errorAddingMajor,
  } = useMutation({
    mutationKey: ["addUserMajor", userId],
    mutationFn: async (majorInput: MajorInput) => {
      // await queryClient.cancelQueries({ queryKey: ["userMajors", userId] });
      return await addUserMajor(majorInput);
    },
    onSuccess: () => {
      if (onSuccess) onSuccess();
      queryClient.refetchQueries({ queryKey: ["userMajors", userId] });
    },
  });

  const {
    mutate: removeMajor,
    isPending: loadingRemoveMajor,
    isError: errorRemovingMajor,
  } = useMutation({
    mutationKey: ["removeUserMajor", userId],
    mutationFn: async (majorId: number) => {
      await queryClient.cancelQueries({ queryKey: ["userMajors", userId] });
      return await removeUserMajor(userId!, majorId);
    },
    onSuccess: () => {
      if (onSuccess) onSuccess();
      queryClient.refetchQueries({ queryKey: ["userMajors", userId] });
    },
  });

  async function handleAddMajor(
    programType: ProgramType,
    name: string,
    catalogYear: string,
  ) {
    // should look into some kind of validation

    if (userId === undefined) return;

    const result = await addMajor({
      name,
      catalogYear,
      userId: userId,
      programType,
    });
    console.log(result);
  }

  return {
    userMajors: userMajors ?? [],
    userMajorsIsLoading,
    onAddMajor: handleAddMajor,
    loadingAddMajor,
    errorAddingMajor,
    onRemoveMajor: removeMajor,
    loadingRemoveMajor,
    errorRemovingMajor,
  };
}

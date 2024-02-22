import { MajorInput, getUserMajorsById, saveUserMajors } from "@actions/major";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

/**
 *
 * @param userId a unique id that identifies a user
 * @param onCompleted a callback to invoke upon completion of a query
 * @returns
 */
export default function useMajorSelection(onSuccess?: () => void) {
  const { data: session } = useSession();
  const userId = session?.user.id;
  // Update user major data
  const queryClient = useQueryClient();
  const { isPending: userMajorsIsLoading, data: userMajors } = useQuery({
    queryKey: ["userMajors", userId],
    queryFn: async () => {
      return await getUserMajorsById(userId!);
    },
    enabled: !!session,
  });

  const {
    mutate: saveMajors,
    isPending: loadingSaveMajor,
    isError: errorSavingMajor,
  } = useMutation({
    mutationKey: ["saveMajors", userId],
    mutationFn: async (majors: MajorInput[]) => {
      await queryClient.cancelQueries({ queryKey: ["userMajors", userId] });
      return await saveUserMajors({ userId: userId!, majors: majors });
    },
    onSuccess: () => {
      if (onSuccess) onSuccess();
      queryClient.refetchQueries({ queryKey: ["userMajors", userId] });
      queryClient.invalidateQueries({ queryKey: ["userMajors", userId] });
    },
  });

  return {
    saveMajors,
    userMajors: userMajors ?? [],
    userMajorsIsLoading,
    loadingSaveMajor,
    errorSavingMajor,
  };
}

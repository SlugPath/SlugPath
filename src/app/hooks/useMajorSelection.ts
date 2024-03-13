import { saveUserPrograms } from "@/app/actions/program";
import { ProgramInput } from "@/app/types/Program";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import { useUserPrograms } from "./reactQuery";

/**
 * Hook for updating program selection React Query state
 * @param onMutateSuccess function to call after program mutation is successful
 * @returns functions for updating program selection
 */
export default function useProgramSelection(onMutateSuccess?: () => void) {
  const queryClient = useQueryClient();

  const { data: session } = useSession();
  const userId = session?.user.id;

  const { data: userPrograms, isPending: userProgramsIsLoading } =
    useUserPrograms(userId!);

  const {
    mutate: savePrograms,
    isPending: loadingSaveProgram,
    isError: errorSavingProgram,
  } = useMutation({
    mutationKey: ["saveMajors", userId],
    mutationFn: async (programs: ProgramInput[]) =>
      await saveUserPrograms({
        userId: userId!,
        programs,
      }),
    onSuccess: () => {
      if (onMutateSuccess) onMutateSuccess();

      queryClient.refetchQueries({ queryKey: ["userMajors", userId] });
      // need to refetch the primary major because it might be null now
      // if we deleted the current primary major and we need to reflect that in the UI
      queryClient.refetchQueries({ queryKey: ["userPrimaryMajor", userId] });
    },
  });

  return {
    saveMajors: savePrograms,
    userMajors: userPrograms ?? [],
    userMajorsIsLoading: userProgramsIsLoading,
    loadingSaveMajor: loadingSaveProgram,
    errorSavingMajor: errorSavingProgram,
  };
}

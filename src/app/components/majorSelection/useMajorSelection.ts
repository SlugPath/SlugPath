import { MajorInput, updateUserMajor } from "@/app/actions/major";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 *
 * @param userId a unique id that identifies a user
 * @param onCompleted a callback to invoke upon completion of a query
 * @returns
 */
export default function useMajorSelection(
  userId?: string,
  onSuccess?: () => void,
) {
  // Update user major data
  const queryClient = useQueryClient();
  const {
    mutate: saveMajor,
    isPending: loadingSaveMajor,
    isError: errorSavingMajorData,
  } = useMutation({
    mutationKey: ["updaterUserMajor", userId],
    mutationFn: async (majorInput: MajorInput) => {
      await queryClient.cancelQueries({ queryKey: ["userMajorData", userId] });
      return await updateUserMajor(majorInput);
    },
    onSuccess: () => {
      if (onSuccess) onSuccess();
      queryClient.refetchQueries({ queryKey: ["userMajorData", userId] });
    },
  });

  function handleSaveMajor(
    name: string,
    catalogYear: string,
    defaultPlannerId: string,
  ) {
    if (userId === undefined) return;
    const majorInput: MajorInput = {
      name,
      catalogYear,
      defaultPlannerId,
      userId: userId,
    };

    saveMajor(majorInput);
  }

  return {
    onSaveMajor: handleSaveMajor,
    loadingSaveMajor,
    errorSavingMajorData,
  };
}

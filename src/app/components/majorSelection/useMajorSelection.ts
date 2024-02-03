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
    mutationFn: async (majorInput: MajorInput) => {
      return await updateUserMajor(majorInput);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userMajorData"] });
      if (onSuccess) {
        onSuccess();
      }
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

import { MajorInput, getUserMajor, updateUserMajor } from "@/app/actions/major";
import { useMutation, useQuery } from "@tanstack/react-query";

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
  const {
    data: userMajorData,
    isLoading: loadingMajorData,
    refetch,
    error: errorLoadingMajorData,
  } = useQuery({
    queryKey: ["userMajor", userId],
    queryFn: async () => {
      return await getUserMajor(userId!);
    },
    enabled: !!userId,
  });

  // Update user major data
  const {
    mutate: saveMajor,
    isPending: loadingSaveMajor,
    isError: errorSavingMajorData,
  } = useMutation({
    mutationFn: async (majorInput: MajorInput) => {
      return await updateUserMajor(majorInput);
    },
    onSuccess: () => {
      refetch();

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
    userMajorData,
    loadingMajorData,
    loadingSaveMajor,
    errorLoadingMajorData,
    errorSavingMajorData,
  };
}

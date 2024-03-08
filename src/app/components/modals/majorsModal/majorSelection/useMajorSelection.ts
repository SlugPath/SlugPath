import { Major } from "@/app/types/Major";
import { MajorInput, getUserMajorsById, saveUserMajors } from "@actions/major";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useState } from "react";

/**
 *
 * @param userId a unique id that identifies a user
 * @param onCompleted a callback to invoke upon completion of a query
 * @returns
 */
export default function useMajorSelection(onSuccess?: () => void) {
  const [userMajors, setUserMajors] = useState<Major[]>([]);
  const { data: session } = useSession();
  const userId = session?.user.id;
  // Update user major data
  const queryClient = useQueryClient();
  const { isPending: userMajorsIsLoading } = useQuery({
    queryKey: ["userMajors", userId],
    queryFn: async () => {
      const res = await getUserMajorsById(userId!);
      setUserMajors(res);
      return res;
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
      const newMajors = await saveUserMajors({
        userId: userId!,
        majors: majors,
      });
      setUserMajors(newMajors);
      return newMajors;
    },
    onSuccess: () => {
      if (onSuccess) onSuccess();
      queryClient.refetchQueries({ queryKey: ["userMajors", userId] });
      // need to refetch the primary major because it might be null now
      // if we deleted the current primary major and we need to reflect that in the UI
      queryClient.refetchQueries({ queryKey: ["userPrimaryMajor", userId] });
    },
  });

  return {
    saveMajors,
    userMajors,
    userMajorsIsLoading,
    loadingSaveMajor,
    errorSavingMajor,
  };
}

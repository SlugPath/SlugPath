import { GET_MAJOR, SAVE_MAJOR } from "@/graphql/queries";
import { MajorInput } from "@/graphql/major/schema";
import { useMutation, useQuery } from "@apollo/client";

/**
 *
 * @param userId a unique id that identifies a user
 * @param onCompleted a callback to invoke upon completion of a query
 * @returns
 */
export default function useMajorSelection(
  userId?: string,
  onCompleted?: () => void,
) {
  // Get user major data from backend
  const {
    data: majorData,
    loading: loadingMajorData,
    refetch,
    error: errorLoadingMajorData,
  } = useQuery(GET_MAJOR, {
    variables: {
      userId: userId,
    },
    skip: userId === undefined,
  });

  // Update user major data
  const userMajorData = majorData ? majorData.getUserMajor : null;
  const [
    saveMajor,
    { loading: loadingSaveMajor, error: errorSavingMajorData },
  ] = useMutation(SAVE_MAJOR, {
    onCompleted: () => {
      if (onCompleted !== undefined) onCompleted();
      refetch();
    },
    onError: (err) => {
      console.error(err);
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

    saveMajor({
      variables: {
        input: majorInput,
      },
    });
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

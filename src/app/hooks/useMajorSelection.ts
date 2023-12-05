import { GET_MAJOR, SAVE_MAJOR } from "@/graphql/queries";
import { MajorInput } from "@/graphql/major/schema";
import { useMutation, useQuery } from "@apollo/client";

export default function useMajorSelection(userId?: string, onCompleted?: any) {
  const {
    data: majorData,
    loading: loadingMajorData,
    refetch,
  } = useQuery(GET_MAJOR, {
    variables: {
      userId: userId,
    },
  });
  const userMajorData = majorData ? majorData.getUserMajor : null;
  const [saveMajor, { loading: loadingSaveMajor }] = useMutation(SAVE_MAJOR, {
    onCompleted: () => {
      onCompleted();
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
    if (userId != undefined) {
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
  }

  return {
    onSaveMajor: handleSaveMajor,
    userMajorData: userMajorData,
    loadingMajorData,
    loadingSaveMajor,
  };
}

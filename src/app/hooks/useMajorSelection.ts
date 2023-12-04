import { GET_MAJOR, SAVE_MAJOR } from "@/graphql/queries";
import { MajorInput } from "@/graphql/major/schema";
import { useMutation, useLazyQuery } from "@apollo/client";
import { useEffect } from "react";

export default function useMajorSelection(userId?: string, onCompleted?: any) {
  const [getMajor, { data: majorData, loading }] = useLazyQuery(GET_MAJOR, {
    variables: {
      userId: userId,
    },
  });
  const [saveMajor, { loading: loadingSaveMajor }] = useMutation(SAVE_MAJOR, {
    onCompleted: () => {
      onCompleted();
    },
    onError: (err) => {
      console.error(err);
    },
  });

  useEffect(() => {
    console.log("useEffect");
    if (userId != undefined) {
      console.log("useMajorSelection: userId changed, refetching");
      getMajor();
    }
  }, [userId, getMajor]);

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
    userMajorData: majorData ? majorData.getUserMajor : null,
    loading,
    loadingSaveMajor,
  };
}

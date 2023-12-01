// import { GET_MAJOR, SAVE_MAJOR } from "@/graphql/queries";
import { MajorInput } from "@/graphql/major/schema";
import { gql, useMutation, useQuery } from "@apollo/client";

export const GET_MAJOR = gql`
  query major($userId: String!) {
    getUserMajor(userId: $userId) {
      name
      catalogYear
      defaultPlanners
    }
  }
`;

export const SAVE_MAJOR = gql`
  mutation saveMajor($major: MajorInput!) {
    updateUserMajor(major: $major) {
      name
      catalogYear
      defaultPlannerId
    }
  }
`;

export default function useMajorSelection(userId?: string, onCompleted?: any) {
  const { data: majorData, loading } = useQuery(GET_MAJOR, {
    variables: {
      userId: userId,
    },
    skip: !userId,
  });
  const [saveMajor, { loading: loadingSaveMajor }] = useMutation(SAVE_MAJOR, {
    onCompleted: (data) => {
      onCompleted(data);
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
          major: majorInput,
        },
      });
    }
  }

  return {
    onSaveMajor: handleSaveMajor,
    majorData,
    loading,
    loadingSaveMajor,
  };
}

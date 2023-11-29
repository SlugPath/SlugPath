// import { GET_MAJOR, SAVE_MAJOR } from "@/graphql/queries";
import { MajorInput } from "@/graphql/major/schema";
import { gql, useMutation, useQuery } from "@apollo/client";

export const GET_MAJOR = gql`
  query major($userId: String!) {
    getMajor(userId: $userId) {
      name
      catalog_year
      default_planner_id
    }
  }
`;

export const SAVE_MAJOR = gql`
  mutation saveMajor($major: MajorInput!) {
    upsertMajor(major: $major) {
      name
      catalog_year
      default_planner_id
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
    catalog_year: string,
    default_planner_id: number,
  ) {
    if (userId != undefined) {
      const majorInput: MajorInput = {
        name: name,
        catalog_year: catalog_year,
        default_planner_id: default_planner_id,
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

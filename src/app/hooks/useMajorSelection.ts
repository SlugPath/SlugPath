// import { GET_MAJOR, SAVE_MAJOR } from "@/graphql/queries";
import { gql, useLazyQuery, useQuery } from "@apollo/client";

export const GET_MAJOR = gql`
  query major($userId: String!) {
    major(userId: $userId) {
      name
      catalog_year
      default_planner_id
    }
  }
`;

export const SAVE_MAJOR = gql`
  mutation saveMajor($userId: String!, $major: MajorInput!) {
    upsertMajor(userId: $userId, major: $major) {
      name
      catalog_year
      default_planner_id
    }
  }
`;

export default function useMajorSelection(userId?: string) {
  const { data: majorData } = useQuery(GET_MAJOR, {
    variables: {
      userId: userId,
    },
    skip: !userId,
  });

  // create useLazyQuery for SAVE_MAJOR
  const [saveMajor] = useLazyQuery(SAVE_MAJOR);

  function handleSaveMajor(
    name: string,
    catalog_year: string,
    default_planner_id: string,
  ) {
    if (userId != undefined) {
      saveMajor({
        variables: {
          userId: userId,
          major: {
            name: name,
            catalog_year: catalog_year,
            default_planner_id: default_planner_id,
          },
        },
      });
    }
  }

  return {
    onSaveMajor: handleSaveMajor,
    majorData,
  };
}

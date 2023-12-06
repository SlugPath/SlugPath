import { GET_MAJOR_DEFAULT_PLANNERS } from "@/graphql/queries";
import { useQuery } from "@apollo/client";

export default function useDefaultPlanners(
  catalogYear: string,
  majorName: string,
) {
  const { data, loading } = useQuery(GET_MAJOR_DEFAULT_PLANNERS, {
    variables: {
      input: {
        catalogYear: catalogYear,
        name: majorName,
      },
    },
    skip: catalogYear === "" || majorName === "",
  });

  return {
    majorDefaultPlanners: data?.getMajorDefaults,
    loading,
  };
}

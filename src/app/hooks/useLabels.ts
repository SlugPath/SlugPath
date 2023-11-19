import { GET_LABELS } from "@/graphql/queries";
import { useQuery } from "@apollo/client";

export function useLabels(userId: string | undefined) {
  const { data, error, loading } = useQuery(GET_LABELS, {
    variables: {
      userId,
    },
    skip: !userId,
  });

  const getLabels = () => {
    return !loading && !error ? data.getLabels : [];
  };

  return {
    labels: getLabels(),
    loading,
  };
}

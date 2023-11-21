import { GET_LABELS } from "@/graphql/queries";
import { useQuery } from "@apollo/client";
import { Label } from "../types/Label";

export function useLabels(userId: string | undefined) {
  const { data, error, loading } = useQuery(GET_LABELS, {
    variables: {
      userId,
    },
    skip: !userId,
  });

  const getLabels = (): Label[] => {
    return !loading && !error ? data.getLabels : [];
  };

  return {
    labels: getLabels(),
    loading,
  };
}

import { getMajorDefaultPlanners } from "@/app/actions/major";
import { useQuery } from "@tanstack/react-query";

export default function useDefaultPlanners(
  catalogYear: string,
  majorName: string,
) {
  const { data: majorDefaultPlanners, isLoading: loading } = useQuery({
    queryKey: ["majorDefaults", catalogYear, majorName],
    queryFn: async () => {
      return await getMajorDefaultPlanners({
        catalogYear,
        name: majorName,
      });
    },
    enabled: !!catalogYear && !!majorName,
  });

  return {
    majorDefaultPlanners,
    loading,
  };
}

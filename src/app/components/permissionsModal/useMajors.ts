import { getMajors } from "@actions/major";
import { useQuery } from "@tanstack/react-query";

export default function useMajors() {
  const { data: majors } = useQuery({
    queryKey: ["allMajors"],
    queryFn: async () => await getMajors(),
    initialData: [],
  });

  return {
    majors,
  };
}

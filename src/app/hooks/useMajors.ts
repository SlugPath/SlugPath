import { getMajors } from "@/app/actions/major";
import { useQuery } from "@tanstack/react-query";

export default function useMajors() {
  const { data: majors } = useQuery({
    queryKey: ["getMajors"],
    queryFn: () => getMajors(),
    initialData: [],
  });

  return {
    majors,
  };
}

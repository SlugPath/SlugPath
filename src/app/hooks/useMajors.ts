import { getMajors } from "@/app/actions/majorActions";
import { useQuery } from "@tanstack/react-query";

export default function useMajors() {
  const { data: majors } = useQuery({
    queryKey: ["getMajors"],
    queryFn: () => getMajors(),
  });

  return {
    majors: majors ?? [],
  };
}

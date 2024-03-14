import { Major } from "@/app/types/Major";
import { getMajors } from "@actions/major";
import { useQuery } from "@tanstack/react-query";

export default function useMajors() {
  const { data: majors } = useQuery({
    queryKey: ["allMajors"],
    queryFn: async () => {
      const m = await getMajors();
      console.log("got m");
      console.log(m);

      return m;
    },
  });

  function filterRedundantMajors(majors: Major[]) {
    const majorNames = new Set();
    return majors.filter((major) => {
      if (majorNames.has(major.name)) {
        return false;
      }
      majorNames.add(major.name);
      return true;
    });
  }

  return {
    majors: majors ? filterRedundantMajors(majors) : [],
  };
}

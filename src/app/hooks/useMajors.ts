import { useQuery } from "@tanstack/react-query";

import { getPrograms } from "../actions/major";
import { Major } from "../types/Major";

// TODO: Extract filter from cache logic
export default function useMajors() {
  const { data: majors } = useQuery({
    queryKey: ["allPrograms"],
    queryFn: async () => await getPrograms(),
    initialData: [],
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
    majors: filterRedundantMajors(majors),
  };
}

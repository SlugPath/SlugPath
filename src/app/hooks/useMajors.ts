import { useEffect, useState } from "react";
import { getMajors } from "@/app/actions/actions";
import { Major } from "../types/Major";

export default function useMajors() {
  const [majors, setMajors] = useState<Major[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getMajors();
        setMajors(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return {
    majors,
  };
}

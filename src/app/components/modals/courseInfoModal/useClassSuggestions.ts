import { getSuggestedClasses } from "@actions/course";
import { StoredCourse } from "@customTypes/Course";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const courseNumberRegex = /[A-Z]{2,6} [0-9]{1,3}[A-Z]*/g;

export default function useClassSuggestions({
  isOpen,
  title,
}: {
  isOpen: boolean;
  title: string;
}) {
  // Get all the course numbers from the custom course title
  const suggestedClasses = Array.from(
    title.toUpperCase().matchAll(courseNumberRegex),
  ).map((m) => m[0]);
  const [classes, setClasses] = useState<StoredCourse[]>([]);

  // Fetch the suggested classes from the database
  const { isLoading: suggestedLoading } = useQuery({
    queryKey: ["suggestedClasses", suggestedClasses],
    queryFn: async () => {
      const suggested = await getSuggestedClasses(suggestedClasses);
      setClasses(suggested);
      return suggested;
    },
    enabled: isOpen && suggestedClasses.length > 0,
  });

  return {
    classes,
    setClasses,
    suggestedLoading,
  };
}

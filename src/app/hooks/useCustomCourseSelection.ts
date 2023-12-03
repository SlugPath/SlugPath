import { useState } from "react";
import { StoredCourse } from "../types/Course";
import { customCourse } from "@/lib/plannerUtils";

export default function useCustomCourseSelection() {
  const [courses, setCourses] = useState<StoredCourse[]>([]);

  const handleAddCustom = (newTitle: string) => {
    setCourses((prev) => {
      const newCourse: StoredCourse = {
        ...customCourse(),
        title: newTitle,
      };
      return [newCourse, ...prev];
    });
  };

  const handleRemoveCustom = (idx: number) => {
    setCourses((prev) => {
      return [...prev.slice(0, idx), ...prev.slice(idx + 1)];
    });
    console.log(`HERE`);
  };

  return {
    customCourses: courses,
    handleAddCustom,
    handleRemoveCustom,
  };
}

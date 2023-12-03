import { useState } from "react";
import { StoredCourse } from "../types/Course";
import { customCourse } from "@/lib/plannerUtils";

export default function useCustomCourseSelection() {
  const [courses, setCourses] = useState<StoredCourse[]>([]);

  const handleAddCustom = (newTitle: string) => {
    setCourses((prev) => {
      const newCourse: any = {
        ...customCourse(),
        title: newTitle,
      };
      delete newCourse.labels;
      console.log(`${JSON.stringify(newCourse, null, 2)}`);
      return [newCourse, ...prev];
    });
  };

  const handleRemoveCustom = (idx: number) => {
    setCourses((prev) => {
      return [...prev.slice(0, idx), ...prev.slice(idx + 1)];
    });
  };

  return {
    customCourses: courses,
    handleAddCustom,
    handleRemoveCustom,
  };
}

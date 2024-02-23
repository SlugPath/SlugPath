import { customCourse } from "@/lib/plannerUtils";
import { CustomCourseInput, StoredCourse } from "@customTypes/Course";
import { useState } from "react";

export default function useCustomCourseSelection() {
  const [courses, setCourses] = useState<StoredCourse[]>([]);

  const handleAddCustom = ({
    title,
    description,
    credits,
    quartersOffered,
  }: CustomCourseInput) => {
    setCourses((prev) => {
      const newCourse: StoredCourse = {
        ...customCourse(),
        title,
        description,
        credits,
        quartersOffered,
      };
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

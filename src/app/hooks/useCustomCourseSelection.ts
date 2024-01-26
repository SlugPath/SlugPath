import { useState } from "react";
import { CustomCourseInput, StoredCourse } from "../types/Course";
import { customCourse } from "@/lib/plannerUtils";

export default function useCustomCourseSelection() {
  const [courses, setCourses] = useState<StoredCourse[]>([]);

  // TODO: Add support for other fields like credits, quarters, description,
  // etc. Currently, only title is supported.
  const handleAddCustom = ({
    title,
    description,
    credits,
    quartersOffered,
  }: CustomCourseInput) => {
    console.log(`custom: ${quartersOffered.length}`);
    setCourses((prev) => {
      const newCourse: any = {
        ...customCourse(),
        title,
        description,
        credits,
        quartersOffered,
      };
      delete newCourse.labels;
      console.log(`newCourse: ${JSON.stringify(newCourse, null, 2)}`);
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

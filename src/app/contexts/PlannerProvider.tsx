import { initializeCustomCourse } from "@/lib/plannerUtils";
import { CustomCourseInput, StoredCourse } from "@customTypes/Course";
import { Label } from "@customTypes/Label";
import { PlannerData } from "@customTypes/Planner";
import { DropResult } from "@hello-pangea/dnd";
import { createContext, useState } from "react";

import useHandleCourseDrag from "../hooks/useHandleCourseDrag";
import usePlanner from "../hooks/usePlanner";

export interface PlannerProviderProps {
  children: React.ReactNode;
  planner: PlannerData;
  setPlanner: (planner: PlannerData) => boolean;
}

export interface PlannerContextProps {
  deleteCourse: (quarterId: string) => (deleteIdx: number) => void;
  editCustomCourse: (course: StoredCourse) => void;
  totalCredits: number;
  geSatisfied: string[];
  courseState: PlannerData;
  replaceCustomCourse: (customId: string, courses: StoredCourse[]) => void;
  handleDragEnd: (result: DropResult) => void;
  getCourseLabels: (course: StoredCourse) => Label[];
  getAllLabels: () => Label[];
  updatePlannerLabels: ({
    labels,
    newCourse,
  }: {
    labels: Label[];
    newCourse?: StoredCourse;
  }) => void;
  customCourses: StoredCourse[];
  handleAddCustom: (input: CustomCourseInput) => void;
  handleRemoveCustom: (idx: number) => void;
  updateNotes: (content: string) => void;
  addYear: () => void;
  deleteYear: (year: number) => void;
}

export const PlannerContext = createContext({} as PlannerContextProps);

export function PlannerProvider({
  children,
  planner,
  setPlanner,
}: PlannerProviderProps) {
  const {
    deleteCourse,
    editCustomCourse,
    totalCredits,
    geSatisfied,
    courseState,
    handleCourseUpdate,
    getCourseLabels,
    getAllLabels,
    updatePlannerLabels,
    updateNotes,
    addYear,
    deleteYear,
    replaceCustomCourse,
  } = usePlanner({
    planner,
    setPlanner,
  });

  const [customCourses, setCustomCourses] = useState<StoredCourse[]>([]);

  const handleAddCustom = ({
    title,
    description,
    credits,
    quartersOffered,
  }: CustomCourseInput) => {
    setCustomCourses((prev) => {
      const newCourse: StoredCourse = {
        ...initializeCustomCourse(),
        title,
        description,
        credits,
        quartersOffered,
      };
      return [newCourse, ...prev];
    });
  };

  const handleRemoveCustom = (idx: number) => {
    setCustomCourses((prev) => {
      return [...prev.slice(0, idx), ...prev.slice(idx + 1)];
    });
  };

  const { handleDragEnd } = useHandleCourseDrag({
    courseState: courseState!,
    handleCourseUpdate,
    handleRemoveCustom,
  });

  return (
    <PlannerContext.Provider
      value={{
        replaceCustomCourse,
        deleteCourse,
        editCustomCourse,
        totalCredits,
        geSatisfied,
        courseState: courseState!,
        handleDragEnd,
        getCourseLabels,
        getAllLabels,
        updatePlannerLabels,
        customCourses,
        handleAddCustom,
        handleRemoveCustom,
        updateNotes,
        addYear,
        deleteYear,
      }}
    >
      {children}
    </PlannerContext.Provider>
  );
}

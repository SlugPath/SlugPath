import { CustomCourseInput, StoredCourse } from "@customTypes/Course";
import { Label } from "@customTypes/Label";
import { PlannerData } from "@customTypes/Planner";
import { DropResult } from "@hello-pangea/dnd";
import { useSession } from "next-auth/react";
import { createContext } from "react";

import useCustomCourseSelection from "../hooks/useCustomCourseSelection";
import useHandleCourseDrag from "../hooks/useHandleCourseDrag";
import usePlanner from "../hooks/usePlanner";

export interface PlannerProviderProps {
  children: React.ReactNode;
  plannerId: string;
  title: string;
  order: number;
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
  plannerId,
  title,
  order,
}: PlannerProviderProps) {
  const { data: session } = useSession();
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
    userId: session?.user.id,
    plannerId: plannerId,
    title,
    order,
  });

  const { customCourses, handleAddCustom, handleRemoveCustom } =
    useCustomCourseSelection();

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

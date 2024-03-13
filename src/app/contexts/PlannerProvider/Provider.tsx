import { useSession } from "next-auth/react";
import { createContext } from "react";

import useCustomCourseSelection from "../../hooks/useCustomCourseSelection";
import useHandleCourseDrag from "../../hooks/useHandleCourseDrag";
import usePlanner from "../../hooks/usePlanner";
import { PlannerContextProps, PlannerProviderProps } from "./Types";

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

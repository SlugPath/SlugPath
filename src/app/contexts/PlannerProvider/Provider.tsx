import { useSession } from "next-auth/react";
import { createContext } from "react";

import { PlannerContextProps, PlannerProviderProps } from "./Types";
import useCustomCourseSelection from "./useCustomCourseSelection";
import useHandleCourseDrag from "./useHandleCourseDrag";
import usePlanner from "./usePlanner";

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
      }}
    >
      {children}
    </PlannerContext.Provider>
  );
}

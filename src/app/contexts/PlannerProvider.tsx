import { createContext } from "react";
import usePlanner from "../components/planner/usePlanner";
import { useSession } from "next-auth/react";
import { PlannerContextProps, PlannerProviderProps } from "../types/Context";
import useHandleCourseDrag from "../hooks/useHandleCourseDrag";
import useCustomCourseSelection from "../components/search/useCustomCourseSelection";

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
    displayCourse,
    setDisplayCourse,
    totalCredits,
    geSatisfied,
    courseState,
    saveStatus,
    saveError,
    handleCourseUpdate,
    getCourseLabels,
    getAllLabels,
    editCourseLabels,
    updatePlannerLabels,
    updateNotes,
  } = usePlanner({
    userId: session?.user.id,
    plannerId: plannerId,
    title,
    order,
  });

  const { customCourses, handleAddCustom, handleRemoveCustom } =
    useCustomCourseSelection();

  const { handleDragEnd } = useHandleCourseDrag({
    courseState,
    handleCourseUpdate,
    handleRemoveCustom,
  });

  return (
    <PlannerContext.Provider
      value={{
        deleteCourse,
        editCustomCourse,
        displayCourse,
        setDisplayCourse,
        totalCredits,
        geSatisfied,
        courseState,
        handleDragEnd,
        saveStatus,
        saveError,
        getCourseLabels,
        getAllLabels,
        editCourseLabels,
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

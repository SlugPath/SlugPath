import { createContext } from "react";
import usePlanner from "../hooks/usePlanner";
import { useSession } from "next-auth/react";
import { PlannerContextProps, PlannerProviderProps } from "../types/Context";
import useHandleCourseDrag from "../hooks/useHandleCourseDrag";

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
    saveStatus,
    saveError,
    handleCourseUpdate,
  } = usePlanner({
    userId: session?.user.id,
    plannerId: plannerId,
    title,
    order,
  });

  const { handleDragEnd } = useHandleCourseDrag({
    courseState,
    handleCourseUpdate,
  });

  return (
    <PlannerContext.Provider
      value={{
        deleteCourse,
        editCustomCourse,
        totalCredits,
        geSatisfied,
        courseState,
        handleDragEnd,
        saveStatus,
        saveError,
      }}
    >
      {children}
    </PlannerContext.Provider>
  );
}

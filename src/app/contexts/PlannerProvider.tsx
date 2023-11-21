import { createContext } from "react";
import usePlanner from "../hooks/usePlanner";
import { useSession } from "next-auth/react";
import { PlannerContextProps, PlannerProviderProps } from "../types/Context";

export const PlannerContext = createContext({} as PlannerContextProps);

export function PlannerProvider({
  children,
  plannerId,
  title,
  order,
}: PlannerProviderProps) {
  const { data: session } = useSession();
  const {
    handleOnDragStart,
    deleteCourse,
    editCourse,
    totalCredits,
    unavailableQuarters,
    courseState,
    handleDragEnd,
    memoAlreadyCourses,
    saveStatus,
    saveError,
  } = usePlanner({
    userId: session?.user.id,
    plannerId: plannerId,
    title,
    order,
  });

  return (
    <PlannerContext.Provider
      value={{
        handleOnDragStart,
        deleteCourse,
        editCourse,
        totalCredits,
        unavailableQuarters,
        courseState,
        handleDragEnd,
        memoAlreadyCourses,
        saveStatus,
        saveError,
      }}
    >
      {children}
    </PlannerContext.Provider>
  );
}

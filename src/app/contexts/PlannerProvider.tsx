import { createContext } from "react";
import usePlanner from "../hooks/usePlanner";
import { useSession } from "next-auth/react";
import { DragStart, DropResult } from "@hello-pangea/dnd";
import { PlannerData } from "@/graphql/planner/schema";
import { ApolloError } from "@apollo/client";

interface PlannerContextProps {
  handleOnDragStart: (start: DragStart) => void;
  deleteCourse: (quarterId: string) => (deleteIdx: number) => void;
  totalCredits: number;
  unavailableQuarters: string[];
  courseState: PlannerData;
  handleDragEnd: (result: DropResult) => void;
  memoAlreadyCourses: string[];
  saveStatus: boolean;
  saveError: ApolloError | undefined;
}

export const PlannerContext = createContext({} as PlannerContextProps);

interface PlannerProviderProps {
  children: React.ReactNode;
  plannerId: string;
  title: string;
  order: number;
}

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

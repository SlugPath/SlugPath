import { ChangeEvent, SetStateAction } from "react";
import { StoredCourse } from "./Course";
import { PlannerData } from "./PlannerData";
import { DropResult } from "@hello-pangea/dnd";
import { ApolloError } from "@apollo/client";
import { MultiPlanner } from "./MultiPlanner";
import { Label } from "./Label";
import { Term } from "./Quarter";

type setShow = React.Dispatch<SetStateAction<boolean>>;

export interface ModalsContextProps {
  showExportModal: boolean;
  setShowExportModal: setShow;
  showCourseInfoModal: boolean;
  setShowCourseInfoModal: setShow;
  onShowCourseInfoModal: () => void;
  courseState: PlannerData;
}

export interface PlannerContextProps {
  deleteCourse: (quarterId: string) => (deleteIdx: number) => void;
  editCourse: (
    number: string,
    department: string,
    newCourse: StoredCourse,
  ) => void;
  getCourse: (number: string, department: string) => StoredCourse | undefined;
  displayCourse: [StoredCourse, Term | undefined] | undefined;
  setDisplayCourse: any;
  totalCredits: number;
  geSatisfied: string[];
  courseState: PlannerData;
  handleDragEnd: (result: DropResult) => void;
  memoAlreadyCourses: string[];
  saveStatus: boolean;
  saveError: ApolloError | undefined;
}

export interface PlannerProviderProps {
  children: React.ReactNode;
  plannerId: string;
  title: string;
  order: number;
}

export interface PlannersContextProps {
  planners: MultiPlanner;
  removePlanner: (plannerId: string) => void;
  addPlanner: () => void;
  switchPlanners: (id: string, title: string) => void;
  changePlannerName: (event: ChangeEvent<HTMLInputElement>, id: string) => void;
  activePlanner: { id: string; title: string } | undefined;
}

export interface LabelsContextProps {
  labels: Label[];
  updateLabels: (label: Label[]) => void;
}

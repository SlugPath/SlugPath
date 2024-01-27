import { SetStateAction } from "react";
import { CustomCourseInput, StoredCourse } from "./Course";
import { PlannerData } from "./PlannerData";
import { DropResult } from "@hello-pangea/dnd";
import { ApolloError } from "@apollo/client";
import { Label } from "./Label";
import { Term } from "./Quarter";
import { PlannerTitle } from "@/graphql/planner/schema";

type setShow = React.Dispatch<SetStateAction<boolean>>;

export interface ModalsContextProps {
  showExportModal: boolean;
  setShowExportModal: setShow;
  showCourseInfoModal: boolean;
  setShowCourseInfoModal: setShow;
  onShowCourseInfoModal: () => void;
  showMajorSelectionModal: boolean;
  setShowMajorSelectionModal: setShow;
  courseState: PlannerData;
}

export interface PlannerContextProps {
  deleteCourse: (quarterId: string) => (deleteIdx: number) => void;
  editCustomCourse: (course: StoredCourse) => void;
  displayCourse: [StoredCourse, Term | undefined] | undefined;
  setDisplayCourse: any;
  totalCredits: number;
  geSatisfied: string[];
  courseState: PlannerData;
  handleDragEnd: (result: DropResult) => void;
  saveStatus: boolean;
  saveError: ApolloError | undefined;
  getCourseLabels: (course: StoredCourse) => Label[];
  getAllLabels: () => Label[];
  editCourseLabels: (course: StoredCourse) => void;
  updatePlannerLabels: (labels: Label[]) => void;
  customCourses: StoredCourse[];
  handleAddCustom: (input: CustomCourseInput) => void;
  handleRemoveCustom: (idx: number) => void;
  updateNotes: (content: string) => void;
}

export interface PlannerProviderProps {
  children: React.ReactNode;
  plannerId: string;
  title: string;
  order: number;
}

export interface PlannersContextProps {
  planners: PlannerTitle[];
  removePlanner: (plannerId: string) => void;
  addPlanner: () => void;
  switchPlanners: (id: string) => void;
  changePlannerName: (id: string, newTitle: string) => void;
  replaceCurrentPlanner: () => void;
  activePlanner: string | undefined;
  plannersLoading: boolean;
  loadingDeletePlanner: boolean;
  deletedPlanner: boolean;
}

export interface LabelsContextProps {
  labels: Label[];
  updateLabels: (label: Label[]) => void;
}

export interface DefaultPlannerContextProps {
  defaultPlanner: PlannerData;
  hasAutoFilled: boolean;
  setHasAutoFilled: any;
  setDefaultPlanner: any;
}

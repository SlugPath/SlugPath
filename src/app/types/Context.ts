import { DropResult } from "@hello-pangea/dnd";

import { UserMajorOutput } from "../actions/major";
import { SetState } from "./Common";
import { CourseTerm, CustomCourseInput, StoredCourse } from "./Course";
import { Label } from "./Label";
import { PlannerData } from "./Planner";

type setShow = SetState<boolean>;

export interface ModalsContextProps {
  showExportModal: boolean;
  setShowExportModal: setShow;
  showCourseInfoModal: boolean;
  setShowCourseInfoModal: setShow;
  onShowCourseInfoModal: () => void;
  showMajorSelectionModal: boolean;
  setShowMajorSelectionModal: setShow;
  courseState: PlannerData;
  displayCourse: CourseTerm;
  setDisplayCourse: SetState<CourseTerm>;
}

export interface PlannerContextProps {
  deleteCourse: (quarterId: string) => (deleteIdx: number) => void;
  editCustomCourse: (course: StoredCourse) => void;
  totalCredits: number;
  geSatisfied: string[];
  courseState: PlannerData;
  handleDragEnd: (result: DropResult) => void;
  savePlanner: () => void;
  saveStatus: boolean;
  saveError: boolean;
  unsavedChanges: boolean;
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
  planners: PlannerData[];
  removePlanner: (plannerId: string) => void;
  addPlanner: () => void;
  getPlanner: (id: string) => PlannerData;
  setPlanner: (id: string, title: string, courseState: PlannerData) => void;
  switchPlanners: (id: string) => void;
  changePlannerName: (id: string, newTitle: string) => void;
  replaceCurrentPlanner: () => void;
  activePlanner: string | undefined;
  loadingDeletePlanner: boolean;
  deletedPlanner: boolean;
}

export interface DefaultPlannerContextProps {
  defaultPlanner: PlannerData;
  hasAutoFilled: boolean;
  setHasAutoFilled: SetState<boolean>;
  setDefaultPlannerId: SetState<string>;
  loadingDefaultPlanner: boolean;
  userMajorData: UserMajorOutput | null;
  loadingMajorData: boolean;
  errorMajorData: Error | null;
}

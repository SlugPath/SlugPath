import { PlannerTitle } from "@/graphql/planner/schema";
import { ApolloError } from "@apollo/client";
import { DropResult } from "@hello-pangea/dnd";

import { SetState } from "./Common";
import { CourseTerm, CustomCourseInput, StoredCourse } from "./Course";
import { Label } from "./Label";
import { PlannerData } from "./PlannerData";
import { RequirementList, Requirements } from "./Requirements";

type setShow = SetState<boolean>;

export interface ModalsContextProps {
  showExportModal: boolean;
  setShowExportModal: setShow;
  showCourseInfoModal: boolean;
  setShowCourseInfoModal: setShow;
  onShowCourseInfoModal: () => void;
  showMajorSelectionModal: boolean;
  setShowMajorSelectionModal: setShow;
  showMajorProgressModal: boolean;
  setShowMajorProgressModal: setShow;
  showPermissionsModal: boolean;
  setShowPermissionsModal: setShow;
  showReplaceRLModal: boolean;
  setShowReplaceRLModal: setShow;
  courseState: PlannerData;
}

export interface PlannerContextProps {
  deleteCourse: (quarterId: string) => (deleteIdx: number) => void;
  editCustomCourse: (course: StoredCourse) => void;
  displayCourse: CourseTerm;
  setDisplayCourse: SetState<CourseTerm>;
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
  setHasAutoFilled: SetState<boolean>;
  setDefaultPlanner: SetState<PlannerData>;
}

export interface MajorVerificationContextProps {
  isMajorRequirementsSatisfied: (
    requirements: Requirements,
    courses: StoredCourse[],
  ) => boolean;
  majorRequirements: RequirementList;
  majorProgressPercentage: number;
  errors: string;
  loadingSave: boolean;
  isSaved: boolean;
  findRequirementList: (
    id: string,
    requirements: RequirementList,
  ) => RequirementList | null;
  addRequirementList: (parentRequirementListId: string) => void;
  removeRequirementList: (requirementListId: string) => void;
  updateRequirementList: (
    requirementListId: string,
    newRequirementList: RequirementList,
  ) => void;
  onSaveMajorRequirements: () => void;
}

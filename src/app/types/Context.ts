import { DropResult } from "@hello-pangea/dnd";

import { UserMajorOutput } from "../actions/major";
import { SetState } from "./Common";
import { CourseTerm, CustomCourseInput, StoredCourse } from "./Course";
import { Label } from "./Label";
import { Permissions } from "./Permissions";
import { PlannerData } from "./Planner";
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
  getCourseLabels: (course: StoredCourse) => Label[];
  getAllLabels: () => Label[];
  updatePlannerLabels: ({
    labels,
    newCourse,
  }: {
    labels: Label[];
    newCourse?: StoredCourse;
  }) => void;
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
  duplicatePlanner: (id: string) => void;
  activePlanner: string | undefined;
  deletedPlanner: boolean;
}

export interface DefaultPlannerContextProps {
  defaultPlanner: PlannerData;
  setDefaultPlannerId: SetState<string>;
  loadingDefaultPlanner: boolean;
  userMajorData: UserMajorOutput | null;
  loadingMajorData: boolean;
  errorMajorData: Error | null;
}

export interface MajorVerificationContextProps {
  isMajorRequirementsSatisfied: (
    requirements: Requirements,
    courses: StoredCourse[],
  ) => boolean;
  majorRequirements: RequirementList;
  calculateMajorProgressPercentage: (courseState: PlannerData) => number;
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

export interface PermissionsContextProps {
  loadingPermissions: boolean;
  isSaved: boolean;
  permissionsList: Permissions[];
  onSetPermissionsList: (permissions: Permissions[]) => void;
  onSavePermissions: () => void;
  isAdmin: boolean;
  hasPermissionToEdit: boolean;
}

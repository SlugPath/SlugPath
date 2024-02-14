import { DropResult } from "@hello-pangea/dnd";

import { MajorOutput } from "../actions/major";
import { SetState } from "./Common";
import { CourseTerm, CustomCourseInput, StoredCourse } from "./Course";
import { Label } from "./Label";
import { Major } from "./Major";
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
  showMajorRequirementsEditModal: boolean;
  setShowMajorRequirementsEditModal: setShow;
  showPermissionsModal: boolean;
  setShowPermissionsModal: setShow;
  showReplaceRLModal: boolean;
  setShowReplaceRLModal: setShow;
  courseState: PlannerData;
  displayCourse: CourseTerm;
  setDisplayCourse: SetState<CourseTerm>;
  majorToEdit: Major | undefined;
  setMajorToEdit: SetState<Major | undefined>;
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
  activePlanner: string | undefined;
  deletedPlanner: boolean;
}

export interface DefaultPlannerContextProps {
  userMajors: MajorOutput[];
  defaultPlanner: PlannerData;
  setDefaultPlannerId: SetState<string>;
  loadingDefaultPlanner: boolean;
  userMajorsIsLoading: boolean;
  saveMajors: (majors: MajorOutput[]) => void;
  loadingSaveMajor: boolean;
  errorSavingMajor: boolean;
}

export interface MajorVerificationContextProps {
  isMajorRequirementsSatisfied: (
    requirements: Requirements,
    courses: StoredCourse[],
  ) => boolean;
  getRequirementsForMajor: (majorId: number) => RequirementList | undefined;
  getLoadingSave: (majorId: number) => boolean;
  getIsSaved: (majorId: number) => boolean;
  calculateMajorProgressPercentage: (courseState: PlannerData) => number;
  errors: string;
  findRequirementList: (
    id: string,
    requirements: RequirementList,
  ) => RequirementList | null;
  addRequirementList: (
    majorId: number,
    parentRequirementListId: string,
  ) => void;
  removeRequirementList: (majorId: number, requirementListId: string) => void;
  updateRequirementList: (
    majorId: number,
    requirementListId: string,
    newRequirementList: RequirementList,
  ) => void;
  onSaveMajorRequirements: (majorId: number) => void;
}

export interface PermissionsContextProps {
  loadingPermissions: boolean;
  isSaved: boolean;
  permissionsList: Permissions[];
  onSetPermissionsList: (permissions: Permissions[]) => void;
  onSavePermissions: () => void;
  isAdmin: boolean;
  majorsAllowedToEdit: Major[];
}

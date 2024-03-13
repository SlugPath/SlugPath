import { Program } from "@/app/types/Program";
import { SetShow, SetState } from "@customTypes/Common";
import { PlannerData } from "@customTypes/Planner";

export interface ModalsContextProps {
  showExportModal: boolean;
  setShowExportModal: SetShow;
  showMajorsModal: boolean;
  setShowMajorsModal: SetShow;
  showPermissionsModal: boolean;
  setShowPermissionsModal: SetShow;
  showReplaceRLModal: boolean;
  setShowReplaceRLModal: SetShow;
  showMajorRequirementsEditModal: boolean;
  setShowMajorRequirementsEditModal: SetShow;
  courseState: PlannerData;
  majorToEdit: Program | undefined;
  setMajorToEdit: SetState<Program | undefined>;
}

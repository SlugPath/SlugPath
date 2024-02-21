import { SetShow } from "@customTypes/Common";
import { PlannerData } from "@customTypes/Planner";

export interface ModalsContextProps {
  showExportModal: boolean;
  setShowExportModal: SetShow;
  showMajorSelectionModal: boolean;
  setShowMajorSelectionModal: SetShow;
  showMajorProgressModal: boolean;
  setShowMajorProgressModal: SetShow;
  showPermissionsModal: boolean;
  setShowPermissionsModal: SetShow;
  showReplaceRLModal: boolean;
  setShowReplaceRLModal: SetShow;
  courseState: PlannerData;
}

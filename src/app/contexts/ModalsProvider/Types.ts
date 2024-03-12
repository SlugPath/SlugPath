import { Major } from "@/app/types/Major";
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
  showSuggestionsModal: boolean;
  setShowSuggestionsModal: SetShow;
  courseState: PlannerData;
  majorToEdit: Major | undefined;
  setMajorToEdit: SetState<Major | undefined>;
  majorToSuggest: Major | undefined;
  setMajorToSuggest: SetState<Major | undefined>;
}

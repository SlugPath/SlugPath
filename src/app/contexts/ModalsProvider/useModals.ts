import { Major } from "@/app/types/Major";
import { useState } from "react";

export default function useModals() {
  const [showExportModal, setShowExportModal] = useState(false);
  const [showMajorsModal, setShowMajorsModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [showReplaceRLModal, setShowReplaceRLModal] = useState(false); // RL = Requirement List
  const [showMajorRequirementsEditModal, setShowMajorRequirementsEditModal] =
    useState(false);
  const [majorToEdit, setMajorToEdit] = useState<Major | undefined>(undefined);
  const [showSuggestionsModal, setShowSuggestionsModal] = useState(false);

  return {
    showExportModal,
    setShowExportModal,
    showMajorsModal,
    setShowMajorsModal,
    showPermissionsModal,
    setShowPermissionsModal,
    showReplaceRLModal,
    setShowReplaceRLModal,
    showMajorRequirementsEditModal,
    setShowMajorRequirementsEditModal,
    showSuggestionsModal,
    setShowSuggestionsModal,
    majorToEdit,
    setMajorToEdit,
  };
}

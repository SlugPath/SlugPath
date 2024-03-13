import { Major } from "@/app/types/Major";
import { useState } from "react";

export default function useModals() {
  const [showExportModal, setShowExportModal] = useState(false);
  const [showMajorsModal, setShowMajorsModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [showReplaceRLModal, setShowReplaceRLModal] = useState(false); // RL = Requirement List
  const [showMajorRequirementsEditModal, setShowMajorRequirementsEditModal] =
    useState(false);
  const [showSuggestionsModal, setShowSuggestionsModal] = useState(false);
  const [majorToEdit, setMajorToEdit] = useState<Major | undefined>(undefined);
  const [userToEdit, setUserToEdit] = useState<string | undefined>(undefined);
  const [majorToSuggest, setMajorToSuggest] = useState<Major | undefined>(
    undefined,
  );

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
    userToEdit,
    setUserToEdit,
    majorToSuggest,
    setMajorToSuggest,
  };
}

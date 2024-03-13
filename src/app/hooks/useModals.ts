import { Program } from "@/app/types/Program";
import { useState } from "react";

export default function useModals() {
  const [showExportModal, setShowExportModal] = useState(false);
  const [showMajorsModal, setShowMajorsModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [showReplaceRLModal, setShowReplaceRLModal] = useState(false); // RL = Requirement List
  const [showMajorRequirementsEditModal, setShowMajorRequirementsEditModal] =
    useState(false);
  const [majorToEdit, setMajorToEdit] = useState<Program | undefined>(
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
    majorToEdit,
    setMajorToEdit,
  };
}

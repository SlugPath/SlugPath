import { Program } from "@/app/types/Program";
import { useState } from "react";

export default function useModals() {
  const [showMajorsModal, setShowMajorsModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [showReplaceRLModal, setShowReplaceRLModal] = useState(false); // RL = Requirement List
  const [showMajorRequirementsEditModal, setShowMajorRequirementsEditModal] =
    useState(false);
  const [showNewPlannerModal, setShowNewPlannerModal] = useState(false);
  const [majorToEdit, setMajorToEdit] = useState<Program | undefined>(
    undefined,
  );

  return {
    showMajorsModal,
    setShowMajorsModal,
    showPermissionsModal,
    setShowPermissionsModal,
    showReplaceRLModal,
    setShowReplaceRLModal,
    showMajorRequirementsEditModal,
    setShowMajorRequirementsEditModal,
    showNewPlannerModal,
    setShowNewPlannerModal,
    majorToEdit,
    setMajorToEdit,
  };
}

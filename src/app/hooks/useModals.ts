import { Program } from "@/app/types/Program";
import { useState } from "react";

export default function useModals() {
  const [showMajorsModal, setShowMajorsModal] = useState(false);
  const [showReplaceRLModal, setShowReplaceRLModal] = useState(false); // RL = Requirement List
  const [showMajorRequirementsEditModal, setShowMajorRequirementsEditModal] =
    useState(false);
  const [majorToEdit, setMajorToEdit] = useState<Program | undefined>(
    undefined,
  );

  return {
    showMajorsModal,
    setShowMajorsModal,
    showReplaceRLModal,
    setShowReplaceRLModal,
    showMajorRequirementsEditModal,
    setShowMajorRequirementsEditModal,
    majorToEdit,
    setMajorToEdit,
  };
}

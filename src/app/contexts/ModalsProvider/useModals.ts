import { useState } from "react";

export default function useModals() {
  const [showExportModal, setShowExportModal] = useState(false);
  const [showMajorSelectionModal, setShowMajorSelectionModal] = useState(false);
  const [showMajorProgressModal, setShowMajorProgressModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [showReplaceRLModal, setShowReplaceRLModal] = useState(false); // RL = Requirement List

  return {
    showExportModal,
    setShowExportModal,
    showMajorSelectionModal,
    setShowMajorSelectionModal,
    showMajorProgressModal,
    setShowMajorProgressModal,
    showPermissionsModal,
    setShowPermissionsModal,
    showReplaceRLModal,
    setShowReplaceRLModal,
  };
}

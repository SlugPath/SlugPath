import { useState } from "react";

export default function useModals() {
  const [showMajorCompletionModal, setShowMajorCompletionModal] =
    useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showCourseInfoModal, setShowCourseInfoModal] = useState(false);

  function handleShowCourseInfoModal() {
    setShowCourseInfoModal(true);
  }

  return {
    showMajorCompletionModal,
    setShowMajorCompletionModal,
    showExportModal,
    setShowExportModal,
    showCourseInfoModal,
    setShowCourseInfoModal,
    onShowCourseInfoModal: handleShowCourseInfoModal,
  };
}

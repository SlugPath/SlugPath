import { StoredCourse } from "@/app/types/Course";
import { Term } from "@/app/types/Quarter";
import { useState } from "react";

export default function useModals() {
  const [showExportModal, setShowExportModal] = useState(false);
  const [showCourseInfoModal, setShowCourseInfoModal] = useState(false);
  const [showMajorSelectionModal, setShowMajorSelectionModal] = useState(false);

  function handleShowCourseInfoModal() {
    setShowCourseInfoModal(true);
  }

  const [displayCourse, setDisplayCourse] = useState<
    [StoredCourse, Term | undefined] | undefined
  >();

  return {
    showExportModal,
    setShowExportModal,
    showCourseInfoModal,
    setShowCourseInfoModal,
    displayCourse,
    setDisplayCourse,
    onShowCourseInfoModal: handleShowCourseInfoModal,
    showMajorSelectionModal,
    setShowMajorSelectionModal,
  };
}

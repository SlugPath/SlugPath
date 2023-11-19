import { useState } from "react";
import { StoredCourse } from "../types/Course";
import { Term } from "../types/Quarter";

export default function useModals() {
  const [showMajorCompletionModal, setShowMajorCompletionModal] =
    useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showCourseInfoModal, setShowCourseInfoModal] = useState(false);
  const [displayCourse, setDisplayCourse] = useState<
    [StoredCourse, Term | undefined] | undefined
  >();

  function handleShowCourseInfoModal(
    courseTerm: [StoredCourse, Term | undefined],
  ) {
    setDisplayCourse(courseTerm);
    setShowCourseInfoModal(true);
  }

  return {
    showMajorCompletionModal,
    setShowMajorCompletionModal,
    showExportModal,
    setShowExportModal,
    showCourseInfoModal,
    setShowCourseInfoModal,
    displayCourse,
    setDisplayCourse,
    onShowCourseInfoModal: handleShowCourseInfoModal,
  };
}

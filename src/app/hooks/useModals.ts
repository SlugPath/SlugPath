import { useState } from "react";
import { StoredCourse } from "../types/Course";

export default function useModals() {
  const [showMajorCompletionModal, setShowMajorCompletionModal] =
    useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showCourseInfoModal, setShowCourseInfoModal] = useState(false);
  const [displayCourse, setDisplayCourse] = useState<
    StoredCourse | undefined
  >();

  function handleShowCourseInfoModal(course: StoredCourse) {
    setDisplayCourse(course);
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

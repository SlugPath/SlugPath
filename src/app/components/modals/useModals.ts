import { StoredCourse } from "@/app/types/Course";
import { Major } from "@/app/types/Major";
import { Term } from "@/app/types/Quarter";
import { useState } from "react";

export default function useModals() {
  const [showExportModal, setShowExportModal] = useState(false);
  const [showCourseInfoModal, setShowCourseInfoModal] = useState(false);
  const [showMajorSelectionModal, setShowMajorSelectionModal] = useState(false);
  const [showMajorProgressModal, setShowMajorProgressModal] = useState(false);
  const [showMajorRequirementsEditModal, setShowMajorRequirementsEditModal] =
    useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [showReplaceRLModal, setShowReplaceRLModal] = useState(false); // RL = Requirement List

  const [displayCourse, setDisplayCourse] = useState<
    [StoredCourse, Term | undefined] | undefined
  >();
  const [majorToEdit, setMajorToEdit] = useState<Major>();

  function handleShowCourseInfoModal() {
    setShowCourseInfoModal(true);
  }

  return {
    showExportModal,
    setShowExportModal,
    showCourseInfoModal,
    setShowCourseInfoModal,
    displayCourse,
    setDisplayCourse,
    majorToEdit,
    setMajorToEdit,
    onShowCourseInfoModal: handleShowCourseInfoModal,
    showMajorSelectionModal,
    setShowMajorSelectionModal,
    showMajorProgressModal,
    setShowMajorProgressModal,
    showMajorRequirementsEditModal,
    setShowMajorRequirementsEditModal,
    showPermissionsModal,
    setShowPermissionsModal,
    showReplaceRLModal,
    setShowReplaceRLModal,
  };
}

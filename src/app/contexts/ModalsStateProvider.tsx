import { createContext, useState } from "react";
import { StoredCourse } from "../types/Course";

interface ModalsStateContextProps {
  showMajorCompletionModal: boolean;
  setShowMajorCompletionModal: any;
  showExportModal: boolean;
  setShowExportModal: any;
  showCourseInfoModal: boolean;
  setShowCourseInfoModal: any;
  displayCourse: StoredCourse | undefined;
  setDisplayCourse: any;
  onShowCourseInfoModal: (course: StoredCourse) => void;
}

export const ModalsStateContext = createContext({} as ModalsStateContextProps);

interface PlannersProviderProps {
  children: React.ReactNode;
}

function useModalsState() {
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

export function ModalsStateProvider({ children }: PlannersProviderProps) {
  const {
    showMajorCompletionModal,
    setShowMajorCompletionModal,
    showExportModal,
    setShowExportModal,
    showCourseInfoModal,
    setShowCourseInfoModal,
    displayCourse,
    setDisplayCourse,
    onShowCourseInfoModal,
  } = useModalsState();

  return (
    <ModalsStateContext.Provider
      value={{
        showMajorCompletionModal,
        setShowMajorCompletionModal,
        showExportModal,
        setShowExportModal,
        showCourseInfoModal,
        setShowCourseInfoModal,
        displayCourse,
        setDisplayCourse,
        onShowCourseInfoModal,
      }}
    >
      {children}
    </ModalsStateContext.Provider>
  );
}

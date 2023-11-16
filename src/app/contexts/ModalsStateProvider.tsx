import { createContext, useEffect, useState } from "react";
import { StoredCourse } from "../types/Course";
import { initialPlanner } from "@/lib/initialPlanner";

interface ModalsStateContextProps {
  showMajorCompletionModal: boolean;
  setShowMajorCompletionModal: any;
  showExportModal: boolean;
  setShowExportModal: any;
  showCourseInfoModal: boolean;
  setShowCourseInfoModal: any;
  currentCourseState: typeof initialPlanner;
  setCurrentCourseState: any;
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
  const [currentCourseState, setCurrentCourseState] = useState(initialPlanner);
  const [displayCourse, setDisplayCourse] = useState<
    StoredCourse | undefined
  >();

  useEffect(() => {
    console.log("currentCourseState", currentCourseState);
  }, [currentCourseState]);

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
    currentCourseState,
    setCurrentCourseState,
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
    currentCourseState,
    setCurrentCourseState,
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
        currentCourseState,
        setCurrentCourseState,
        displayCourse,
        setDisplayCourse,
        onShowCourseInfoModal,
      }}
    >
      {children}
    </ModalsStateContext.Provider>
  );
}

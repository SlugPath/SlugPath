import { SetStateAction, createContext, useContext, useState } from "react";
import { StoredCourse } from "../types/Course";
import { PlannerContext } from "./PlannerProvider";
import { PlannerData } from "../types/PlannerData";

type setShow = React.Dispatch<SetStateAction<boolean>>;

interface ModalsStateContextProps {
  showMajorCompletionModal: boolean;
  setShowMajorCompletionModal: setShow;
  showExportModal: boolean;
  setShowExportModal: setShow;
  showCourseInfoModal: boolean;
  setShowCourseInfoModal: setShow;
  displayCourse: StoredCourse | undefined;
  setDisplayCourse: any;
  onShowCourseInfoModal: (course: StoredCourse) => void;
  courseState: PlannerData;
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

  const { courseState } = useContext(PlannerContext);

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
        courseState,
      }}
    >
      {children}
    </ModalsStateContext.Provider>
  );
}

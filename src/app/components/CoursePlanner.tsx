import { useState, useEffect } from "react";
import { getCookie, setCookie } from "cookies-next";
import QuarterCard from "./QuarterCard";
import CourseSelectionModal from "./CourseSelectionModal";
import MajorCompletionModal from "./MajorCompletionModal";
import ExportModal from "./ExportModal";
import { dummyData } from "../dummy-course-data";
import { DummyData } from "../ts-types/DummyData";
import { DragDropContext, DropResult, Droppable } from "@hello-pangea/dnd";
import { gql, useQuery } from "@apollo/client";
import { DummyCourse } from "../ts-types/Course";
import { isMobile, MobileWarningModal } from "./isMobile";
import Navbar from "./Navbar";
import Footer from "./Footer";

const query = gql`
  query {
    courses {
      id
      credits
      department
      name
      number
    }
  }
`;

export default function CoursePlanner() {
  const { data, loading, error } = useQuery(query);
  const [courseState, setCourseState] = useState(dummyData);
  const [showCourseSelectionModal, setShowCourseSelectionModal] =
    useState(false);
  const [showMajorCompletionModal, setShowMajorCompletionModal] =
    useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showMobileWarning, setShowMobileWarning] = useState(false);
  const [selectedQuarter, setSelectedQuarter] = useState("");

  // Runs upon initial render
  useEffect(() => {
    const cookieCourseState = getCookie("courseState");
    if (cookieCourseState) {
      setCourseState(JSON.parse(cookieCourseState) as DummyData);
    }
  }, []);

  // Runs upon inital render: checks if user is on mobile device
  useEffect(() => {
    if (isMobile()) {
      setShowMobileWarning(true);
    }
  }, []);

  const handleCourseUpdate = (courseState: DummyData) => {
    setCourseState(courseState);

    // remove all courses, as there are too many to fit into the max cookie size
    setCookie(
      "courseState",
      JSON.stringify({
        ...courseState,
        courses: {},
      }),
    );
  };

  const handleOpenCourseSelectionModal = (quarterId: string) => {
    setSelectedQuarter(quarterId);
    setShowCourseSelectionModal(true);
  };

  const handleAddCoursesFromModal = (courses: DummyCourse[]) => {
    const quarter = courseState.quarters[selectedQuarter];
    const newCourseIds = Array.from(quarter.courseIds);
    courses.forEach((course) => newCourseIds.push(course.id));
    const newQuarter = {
      ...quarter,
      courseIds: newCourseIds,
    };

    const newState = {
      ...courseState,
      quarters: {
        ...courseState.quarters,
        [newQuarter.id]: newQuarter,
      },
    };

    handleCourseUpdate(newState);
  };

  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    // delete course dragged into delete area
    if (
      destination.droppableId == "remove-course-area1" ||
      destination.droppableId == "remove-course-area2"
    ) {
      const startQuarter = courseState.quarters[result.source.droppableId];
      const newCourseIds = Array.from(startQuarter.courseIds);
      newCourseIds.splice(result.source.index, 1);

      const newQuarter = {
        ...startQuarter,
        courseIds: newCourseIds,
      };

      const newState = {
        ...courseState,
        quarters: {
          ...courseState.quarters,
          [newQuarter.id]: newQuarter,
        },
      };

      handleCourseUpdate(newState);
      return;
    }

    const startQuarter = courseState.quarters[source.droppableId];
    const finishQuarter = courseState.quarters[destination.droppableId];
    if (startQuarter === finishQuarter) {
      const newCourseIds = Array.from(startQuarter.courseIds);
      newCourseIds.splice(source.index, 1);
      newCourseIds.splice(destination.index, 0, draggableId);

      const newQuarter = {
        ...startQuarter,
        courseIds: newCourseIds,
      };

      const newState = {
        ...courseState,
        quarters: {
          ...courseState.quarters,
          [newQuarter.id]: newQuarter,
        },
      };

      handleCourseUpdate(newState);
    } else {
      // moving from one list to another
      const startCourseIds = Array.from(startQuarter.courseIds);
      startCourseIds.splice(source.index, 1);
      const newStart = {
        ...startQuarter,
        courseIds: startCourseIds,
      };

      const finishCourseIds = Array.from(finishQuarter.courseIds);
      finishCourseIds.splice(destination.index, 0, draggableId);
      const newFinish = {
        ...finishQuarter,
        courseIds: finishCourseIds,
      };

      const newState = {
        ...courseState,
        quarters: {
          ...courseState.quarters,
          [newStart.id]: newStart,
          [newFinish.id]: newFinish,
        },
      };

      handleCourseUpdate(newState);
    }
  };

  function loadCoursesNotPresentFromData() {
    data.courses.forEach((course: DummyCourse) => {
      if (!courseState.courses[course.id]) {
        courseState.courses[course.id] = course;
      }
    });
  }

  function coursesAlreadyAdded() {
    const coursesAlreadyAdded: DummyCourse[] = [];
    Object.values(courseState.quarters).forEach((quarter) => {
      quarter.courseIds.forEach((courseId) => {
        const course = courseState.courses[courseId];
        if (course) {
          coursesAlreadyAdded.push(course);
        }
      });
    });
    return coursesAlreadyAdded;
  }

  if (error) {
    console.error(error);
    return <p>Oh no...{error.message}</p>;
  }
  if (loading) {
    return <p>Loading....</p>;
  }

  loadCoursesNotPresentFromData();

  return (
    <div className="bg-gray-100 mt-16">
      <Navbar
        setShowExportModal={setShowExportModal}
        setShowMajorCompletionModal={setShowMajorCompletionModal}
      />
      <CourseSelectionModal
        courses={data.courses}
        coursesAlreadyAdded={coursesAlreadyAdded()}
        setShowModal={setShowCourseSelectionModal}
        onAddCourses={handleAddCoursesFromModal}
        showModal={showCourseSelectionModal}
      />
      <ExportModal
        courseState={courseState}
        setShowModal={setShowExportModal}
        showModal={showExportModal}
      />
      <MajorCompletionModal
        setShowModal={setShowMajorCompletionModal}
        showModal={showMajorCompletionModal}
      />
      <MobileWarningModal show={showMobileWarning} />
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <div className="flex">
          <div className="flex-1">
            <RemoveCourseArea droppableId={"remove-course-area1"} />
          </div>
          <div className="flex-3 py-6">
            <Quarters
              courseState={courseState}
              handleOpenCourseSelectionModal={handleOpenCourseSelectionModal}
            />
          </div>
          <div className="flex-1">
            <RemoveCourseArea droppableId={"remove-course-area2"} />
          </div>
        </div>
      </DragDropContext>
      <Footer />
    </div>
  );
}

function RemoveCourseArea({ droppableId }: { droppableId: string }) {
  return (
    <Droppable droppableId={droppableId}>
      {(provided, snapshot) => {
        return (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`h-full ${snapshot.isDraggingOver ? "bg-red-200" : ""}`}
            style={{ height: "100%", minHeight: "48px" }}
          >
            {provided.placeholder}
          </div>
        );
      }}
    </Droppable>
  );
}

function Quarters({
  courseState,
  handleOpenCourseSelectionModal,
}: {
  courseState: DummyData;
  handleOpenCourseSelectionModal: any;
}) {
  return (
    <div className="space-y-2">
      {Array.from(
        { length: dummyData.quartersPerYear },
        (_, index) => index,
      ).map((i) => {
        const slice_val = dummyData.quartersPerYear * i;
        const quarters = courseState.quarterOrder.slice(
          slice_val,
          slice_val + dummyData.quartersPerYear,
        );
        return (
          <div key={i} className="flex flex-row space-x-2">
            {quarters.map((quarterId) => {
              const quarter = courseState.quarters[quarterId];
              const courses = quarter.courseIds.map(
                (courseId) => courseState.courses[courseId],
              );

              return (
                <QuarterCard
                  title={quarter.title}
                  id={quarter.id}
                  key={quarter.id}
                  courses={courses}
                  onOpenCourseSelectionModal={() =>
                    handleOpenCourseSelectionModal(quarter.id)
                  }
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

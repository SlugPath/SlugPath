import { useState, useEffect } from "react";
import QuarterCard from "./QuarterCard";
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
import Search from "./Search";
import { createStoredCourse } from "../logic/Courses";

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
  const [showMajorCompletionModal, setShowMajorCompletionModal] =
    useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showMobileWarning, setShowMobileWarning] = useState(false);

  // Runs upon inital render: checks if user is on mobile device
  useEffect(() => {
    if (isMobile()) {
      setShowMobileWarning(true);
    }
  }, []);

  const handleCourseUpdate = (courseState: DummyData) => {
    setCourseState(courseState);
  };

  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    // add course dragged from 'search-droppable' to quarter
    if (source.droppableId === "search-droppable") {
      const quarter = courseState.quarters[destination.droppableId];
      const newStoredCourses = Array.from(quarter.courses);
      newStoredCourses.splice(
        destination.index,
        0,
        createStoredCourse(courseState.courses[draggableId]),
      );
      const newQuarter = {
        ...quarter,
        courses: newStoredCourses,
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

    // delete course dragged into delete area or search-droppable
    if (
      destination.droppableId == "remove-course-area1" ||
      destination.droppableId == "remove-course-area2" ||
      destination.droppableId == "search-droppable"
    ) {
      const startQuarter = courseState.quarters[result.source.droppableId];
      const newStoredCourses = Array.from(startQuarter.courses);
      newStoredCourses.splice(result.source.index, 1);

      const newQuarter = {
        ...startQuarter,
        courses: newStoredCourses,
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
      // moving course within startQuarter
      const newStoredCourses = Array.from(startQuarter.courses);
      newStoredCourses.splice(source.index, 1);
      newStoredCourses.splice(
        destination.index,
        0,
        startQuarter.courses[source.index],
      );

      const newQuarter = {
        ...startQuarter,
        courses: newStoredCourses,
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
      // moving course from startQuarter to finishQuarter
      const movedStoredCourse = startQuarter.courses[source.index];
      const startStoredCourses = Array.from(startQuarter.courses);
      startStoredCourses.splice(source.index, 1);
      const newStart = {
        ...startQuarter,
        courses: startStoredCourses,
      };

      const finishStoredCourses = Array.from(finishQuarter.courses);
      finishStoredCourses.splice(destination.index, 0, movedStoredCourse);
      const newFinish = {
        ...finishQuarter,
        courses: finishStoredCourses,
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
          <div className="flex-1 px-4 py-6">
            <Search />
          </div>
          <div className="flex-3 py-6">
            <Quarters courseState={courseState} />
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

function Quarters({ courseState }: { courseState: DummyData }) {
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
              const courses = quarter.courses;

              return (
                <QuarterCard
                  title={quarter.title}
                  id={quarter.id}
                  key={quarter.id}
                  courses={courses}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

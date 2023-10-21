import { useState, useEffect } from "react";
import { getCookie, setCookie } from 'cookies-next';
import QuarterCard from "./QuarterCard";
import CourseSelectionModal from "./CourseSelectionModal";
import { dummyData } from "../dummy-course-data";
import { DummyData } from "../ts-types/DummyData";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { gql, useQuery } from "@apollo/client";
import { Course } from "../ts-types/Course";

const query = gql`
  query courses {
    courses {
      id
      name
      number
      credits
      department
    }
  }
`;

export function CoursePlanner() {
  const [courseState, setCourseState] = useState(dummyData);
  const { data, loading, error } = useQuery(query);
  const [showModal, setShowModal] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedQuarter, setSelectedQuarter] = useState("");

  // Runs upon initial render
  useEffect(() => {
    const cookieCourseState = getCookie('courseState');
    if (cookieCourseState) {
      setCourseState(JSON.parse(cookieCourseState) as DummyData);
    }
  }, []);

  const handleCourseUpdate = (courseState: DummyData) => {
    setCourseState(courseState);
    setCookie('courseState', JSON.stringify(courseState));
  }

  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;

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

  const handleOpenCourseSelectionModal = (quarterId: string) => {
    setSelectedQuarter(quarterId);
    setShowModal(true);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAddCourses = (courses: Course[]) => {
    // TODO: write the code to add the courses to the selected quarter
  }

  if (error) {
    console.error(error);
    return <p>Oh no...{error.message}</p>;
  }
  if (loading) {
    return <p>Loading....</p>;
  }

  return (
    <div className="flex min-h-screen flex-col items-center space-between p-6 bg-gray-100 space-y-4">
      <CourseSelectionModal
        courses={data.courses}
        setShowModal={setShowModal}
        showModal={showModal}
      />
      <DragDropContext onDragEnd={handleOnDragEnd} >
        {
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
                    const courses = quarter.courseIds.map((courseId) =>
                      courseState.courses[courseId]
                    );

                    return (
                      <QuarterCard
                        title={quarter.title}
                        id={quarter.id}
                        key={quarter.id}
                        courses={courses}
                        onOpenCourseSelectionModal={() => handleOpenCourseSelectionModal(quarter.id)}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        }
      </DragDropContext>
    </div>
  );
}

export default CoursePlanner;

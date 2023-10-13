import QuarterCard from "./QuarterCard";
import { useState } from "react";
import { dummyData } from "../dummy-course-data";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { Course } from "@/graphql/course/schema";

import { gql, useQuery } from "@apollo/client";

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

      setCourseState(newState);
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

      setCourseState(newState);
    }
  };

  if (data) console.log(data);
  if (error) {
    console.error(error);
    return <p>Oh no...{error.message}</p>;
  }
  if (loading) {
    return <p>Loading....</p>;
  }

  return (
    <div className="flex min-h-screen flex-col items-center space-between p-24 bg-gray-100 space-y-4">
      <div className="grid place-items-center py-10 gap-2">
        <div id="members" className="text-3xl pb-3">
          See the courses! (limited to first 10 for now)
        </div>
        {data.courses.slice(0, 10).map((course: Course) => (
          <div
            key={course.name}
            className="grid grid-cols-2 place-items-center"
          >
            <div className="col-span-1">{course.name}</div>
            <div className="col-span-1">
              {course.department + "" + course.number}
            </div>
          </div>
        ))}
      </div>
      <DragDropContext onDragEnd={handleOnDragEnd}>
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

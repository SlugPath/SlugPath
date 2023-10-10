// import { Card } from "@mui/joy";
import { gql, useQuery } from '@apollo/client'
import QuarterCard from "./QuarterCard";
import { Member } from "../../graphql/member/schema";
import * as React from 'react'
import { dummyData } from '../dummy-course-data'
import { DragDropContext } from 'react-beautiful-dnd'

const quarterNames = ["Fall", "Winter", "Spring"];
const yearNames = ["Freshman", "Sophomore", "Junior", "Senior"];

const AllMembers = gql`
  query members {
    member {
      name
      email
    }
  }
`;

// function quarterComponents() {
//   return (
//     <div className="flex flex-row space-x-4">
//       {quarterNames.map((quarter, index) => (
//         <div key={index}>
//           <QuarterCard title={quarter} />
//         </div>
//       ))}
//     </div>
//   );
// }

// function yearComponents() {
//   return (
//     <div className="flex flex-col space-y-2">
//       {yearNames.map((year, index) => (
//         <div key={index}>
//           {year + " Year"}
//           {quarterComponents()}
//         </div>
//       ))}
//     </div>
//   );
// }

export function CoursePlanner() {
  const [courseState, setCourseState] = React.useState(dummyData)
  const { data, loading, error } = useQuery(AllMembers)

  const handleOnDragEnd = (result) => {
    const { destination, source, draggableId } = result

    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return

    const startQuarter = courseState.quarters[source.droppableId]
    const finishQuarter = courseState.quarters[destination.droppableId]
    if (startQuarter === finishQuarter) {
      const newCourseIds = Array.from(startQuarter.courseIds)
      newCourseIds.splice(source.index, 1)
      newCourseIds.splice(destination.index, 0, draggableId)

      const newQuarter = {
        ...startQuarter,
        courseIds: newCourseIds
      }

      const newState = {
        ...courseState,
        quarters: {
          ...courseState.quarters,
          [newQuarter.id]: newQuarter
        }
      }

      setCourseState(newState)
    } else {
      // moving from one list to another
      const startCourseIds = Array.from(startQuarter.courseIds)
      startCourseIds.splice(source.index, 1)
      const newStart = {
        ...startQuarter,
        courseIds: startCourseIds
      }

      const finishCourseIds = Array.from(finishQuarter.courseIds)
      finishCourseIds.splice(destination.index, 0, draggableId)
      const newFinish = {
        ...finishQuarter,
        courseIds: finishCourseIds
      }

      const newState = {
        ...courseState,
        quarters: {
          ...courseState.quarters,
          [newStart.id]: newStart,
          [newFinish.id]: newFinish
        }
      }

      setCourseState(newState)
    }
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p>Oh no... {error.message}</p>

  return (
    <div className="flex min-h-screen flex-col items-center space-between p-24 bg-gray-100 space-y-4">
      <div className="grid place-items-center py-10 gap-2">
        <div id="members" className="text-3xl pb-3">Meet the team members!</div>
        {data.member.map((member: Member) => (
          <div
            key={member.name}
            className="grid grid-cols-2 place-items-center"
          >
            <div className="col-span-1">{member.name}</div>
            <div className="col-span-1">{member.email}</div>
          </div>
        ))}
      </div>
      <DragDropContext onDragEnd={handleOnDragEnd} >
        <div className="flex flex-row space-x-4" >
          {
            courseState.quarterOrder.map((quarterId) => {
              const quarter = courseState.quarters[quarterId];
              const courses = quarter.courseIds.map(courseId => courseState.courses[courseId]);

              return <QuarterCard title={quarter.title} id={quarter.id} key={quarter.id} courses={courses} />
            })
          }
        </div>
      </DragDropContext>
    </div>
  );
}

export default CoursePlanner;

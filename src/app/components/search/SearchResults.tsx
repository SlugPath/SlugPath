import { SEARCH_DROPPABLE } from "@/lib/consts";
import { createCourseDraggableId } from "@/lib/plannerUtils";
import { StoredCourse } from "@customTypes/Course";
import { Droppable, DroppableStateSnapshot } from "@hello-pangea/dnd";
import { AutoSizer, List } from "react-virtualized";

import CourseCard from "../planner/quarters/courses/CourseCard";
import DraggableCourseCard from "../planner/quarters/courses/DraggableCourseCard";

export interface SearchResultsProps {
  courses: StoredCourse[];
  loading: boolean;
  droppableId?: string;
}

export default function SearchResults({
  courses,
  loading,
  droppableId = SEARCH_DROPPABLE,
}: SearchResultsProps) {
  function hasResults(): boolean {
    return courses.length > 0;
  }

  function getItemCount(snapshot?: DroppableStateSnapshot): number {
    if (courses) {
      return snapshot && snapshot.isUsingPlaceholder
        ? courses.length + 1
        : courses.length;
    } else {
      return 0;
    }
  }

  function getRowRender({
    index,
    key,
    style,
  }: {
    index: number;
    key: string;
    parent: any;
    style: any;
  }) {
    // We are rendering an extra item for the placeholder
    // To do this we increased our data set size to include one 'fake' item
    if (!courses[index]) {
      return null;
    }

    const course = courses[index];

    return (
      <div key={key} style={style}>
        <DraggableCourseCard
          key={index}
          course={course}
          index={index}
          draggableId={createCourseDraggableId({
            ...course,
            suffix: "search",
          })}
          isCustom={false}
        />
      </div>
    );
  }

  return (
    <Droppable
      droppableId={droppableId}
      isDropDisabled={true}
      mode="virtual"
      renderClone={(provided, _, rubric) => {
        const index = rubric.source.index;
        const course = courses[index];
        return (
          <CourseCard
            course={course}
            index={index}
            provided={provided}
            isCustom={false}
          />
        );
      }}
    >
      {(provided, snapshot) => {
        return (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="h-full"
          >
            {hasResults() ? (
              <div className="h-full">
                <div className="overflow-y-auto h-full">
                  <AutoSizer>
                    {({ height, width }) => (
                      <List
                        height={height}
                        rowCount={getItemCount(snapshot)}
                        rowHeight={40}
                        width={width}
                        rowRenderer={(props) => getRowRender(props)}
                      />
                    )}
                  </AutoSizer>
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center overflow-y-auto h-full">
                {!hasResults() && !loading ? (
                  <p className="text-gray-400 text-center">
                    No results. Try changing the search parameters.
                  </p>
                ) : null}
              </div>
            )}
          </div>
        );
      }}
    </Droppable>
  );
}

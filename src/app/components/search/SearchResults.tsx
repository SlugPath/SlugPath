import { StoredCourse } from "@/app/types/Course";
import { createCourseDraggableId } from "@/lib/plannerUtils";
import { Droppable, DroppableStateSnapshot } from "@hello-pangea/dnd";
import { CircularProgress } from "@mui/joy";
import { AutoSizer, List } from "react-virtualized";

import CourseCard from "../planner/quarters/courses/CourseCard";
import DraggableCourseCard from "../planner/quarters/courses/DraggableCourseCard";

export interface SearchResultsProps {
  courses: StoredCourse[];
  loading: boolean;
  loadingUseQuery: boolean;
  searchComponentId: string;
}

export default function SearchResults({
  courses,
  loading,
  loadingUseQuery,
  searchComponentId,
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

  function getResultsString() {
    const itemCount = getItemCount();
    const loadingMoreResultsString = loadingUseQuery
      ? "     Loading more results"
      : "";
    return itemCount.toString() + " results" + loadingMoreResultsString;
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

    const course = courses[index] as StoredCourse;

    return (
      <div key={key} style={style}>
        <DraggableCourseCard
          key={index}
          course={course}
          index={index}
          draggableId={createCourseDraggableId({
            ...course,
            suffix: "search" + searchComponentId,
          })}
          isCustom={false}
        />
      </div>
    );
  }

  return (
    <Droppable
      droppableId={"search-droppable" + searchComponentId}
      isDropDisabled={true}
      mode="virtual"
      renderClone={(provided, snapshot, rubric) => {
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
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {hasResults() ? (
              <div>
                <div className="mb-1">{getResultsString()}</div>
                <div className="overflow-y-auto h-[62vh]">
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
              <div className="flex justify-center items-center h-96">
                {!hasResults() ? (
                  <p className="text-gray-400 text-center">
                    No results. Try changing the search parameters.
                  </p>
                ) : null}
                {loading ? (
                  <CircularProgress variant="plain" color="primary" />
                ) : null}
              </div>
            )}
          </div>
        );
      }}
    </Droppable>
  );
}

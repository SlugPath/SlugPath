import { CircularProgress } from "@mui/joy";
import DraggableCourseCard from "../DraggableCourseCard";
import CourseCard from "../CourseCard";
import { Droppable, DroppableStateSnapshot } from "@hello-pangea/dnd";
import { List, AutoSizer } from "react-virtualized";
import { createCourseDraggableId } from "@/lib/plannerUtils";

export default function SearchResults({
  courses,
  loading,
  loadingUseQuery,
}: {
  courses: any;
  loading: boolean;
  loadingUseQuery: boolean;
}) {
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

    const course = courses[index];

    return (
      <div key={key} style={style}>
        <DraggableCourseCard
          key={index}
          course={course}
          index={index}
          draggableId={createCourseDraggableId(course, "search")}
          isCustom={false}
        />
      </div>
    );
  }

  return (
    <Droppable
      droppableId={"search-droppable"}
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
            isDragging={snapshot.isDragging}
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
                  <p className="text-gray-400">No results</p>
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

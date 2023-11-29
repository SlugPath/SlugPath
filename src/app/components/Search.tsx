import { Card, CircularProgress, Input, Option, Select } from "@mui/joy";
import { StoredCourse } from "../types/Course";
import DraggableCourseCard from "./DraggableCourseCard";
import CourseCard from "./CourseCard";
import { Droppable, DroppableStateSnapshot } from "@hello-pangea/dnd";
import { createIdFromCourse } from "../../lib/courseUtils";
import { List, AutoSizer } from "react-virtualized";
import useSearch from "../hooks/useSearch";

/**
 * Component for searching for courses to add. `coursesAlreadyAdded` is a list of courses that have
 * already been added to the planner and should be disabled for dragging in search results.
 */
export default function Search({
  coursesInPlanner,
}: {
  coursesInPlanner: string[];
}) {
  const {
    data,
    loading,
    departments,
    handleChangeDepartment,
    handleChangeNumber,
    handleChangeGE,
    handleSearch,
    courseIsAlreadyAdded,
    departmentCode,
    number,
    ge,
  } = useSearch({ coursesInPlanner });

  function hasResults(data: any): boolean {
    return data && data.coursesBy.length > 0;
  }

  function noResults(data: any): boolean {
    return (!loading && !data) || (data && data.coursesBy.length == 0);
  }

  function createSearchIdFromCourse(course: StoredCourse): string {
    return createIdFromCourse(course) + "-search";
  }

  function getCourseByIndex(index: number) {
    return data.coursesBy[index];
  }

  function getItemCount(data: any, snapshot?: DroppableStateSnapshot) {
    if (data) {
      return snapshot && snapshot.isUsingPlaceholder
        ? data.coursesBy.length + 1
        : data.coursesBy.length;
    } else {
      return 0;
    }
  }

  function getCoursesList(data: any) {
    if (data) {
      return data.coursesBy.map((course: StoredCourse) => course);
    } else {
      return [];
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
    const courses = getCoursesList(data);
    // We are rendering an extra item for the placeholder
    // Do do this we increased our data set size to include one 'fake' item
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
          draggableId={createSearchIdFromCourse(course)}
          alreadyAdded={courseIsAlreadyAdded(course)}
        />
      </div>
    );
  }

  return (
    <Card className="min-w-40">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleSearch(departmentCode ?? "", number, ge ?? "");
        }}
      >
        <div className="grid grid-cols-2 gap-2 p-2">
          <Select
            placeholder="Department"
            name="department"
            aria-label="department"
            className="col-span-2"
            onChange={handleChangeDepartment}
            value={departmentCode ?? ""}
            size="sm"
          >
            {departments.map((dep) => (
              <Option key={dep.value} value={dep.value}>
                {dep.label}
              </Option>
            ))}
          </Select>
          <Input
            className="col-span-2"
            color="neutral"
            placeholder="Number"
            variant="outlined"
            name="number"
            aria-label="number"
            onChange={(event) => handleChangeNumber(event.target.value)}
            size="sm"
          />
          <Select
            placeholder="GE Requirement"
            name="ge"
            aria-label="ge"
            className="col-span-2"
            onChange={handleChangeGE}
            value={ge ?? ""}
            size="sm"
          >
            <Option value="">--</Option>
            <Option value="c">C</Option>
            <Option value="cc">CC</Option>
            <Option value="er">ER</Option>
            <Option value="im">IM</Option>
            <Option value="mf">MF</Option>
            <Option value="si">SI</Option>
            <Option value="sr">SR</Option>
            <Option value="ta">TA</Option>
            {/* Include options for PE subcategories */}
            <Option value="peT">PE-T</Option>
            <Option value="peH">PE-H</Option>
            <Option value="peE">PE-E</Option>
            {/* Include options for PR subcategories */}
            <Option value="prC">PR-C</Option>
            <Option value="prE">PR-E</Option>
            <Option value="prS">PR-S</Option>
          </Select>
        </div>
      </form>
      <Droppable
        droppableId={"search-droppable"}
        isDropDisabled={true}
        mode="virtual"
        renderClone={(provided, snapshot, rubric) => {
          const index = rubric.source.index;
          const course = getCourseByIndex(index);
          return (
            <CourseCard
              course={course}
              index={index}
              alreadyAdded={courseIsAlreadyAdded(course)}
              provided={provided}
              isDragging={snapshot.isDragging}
            />
          );
        }}
      >
        {(provided, snapshot) => {
          return (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {hasResults(data) ? (
                <div>
                  <div className="mb-1">{getItemCount(data)} results</div>
                  <div className="overflow-y-auto h-[62vh]">
                    <AutoSizer>
                      {({ height, width }) => (
                        <List
                          height={height}
                          rowCount={getItemCount(data, snapshot)}
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
                  {noResults(data) ? (
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
    </Card>
  );
}

import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { Card, CircularProgress, Input, Option, Select } from "@mui/joy";
import { StoredCourse } from "../types/Course";
import DraggableCourseCard from "./DraggableCourseCard";
import CourseCard from "./CourseCard";
import { Droppable, DroppableStateSnapshot } from "@hello-pangea/dnd";
import { createIdFromCourse } from "../../lib/courseUtils";
import { List, AutoSizer } from "react-virtualized";
import useDebounce from "../hooks/useDebounce";
import { GET_COURSES, GET_DEPARTMENTS } from "../../graphql/queries";

/**
 * Component for searching for courses to add. `coursesAlreadyAdded` is a list of courses that have
 * already been added to the planner and should be disabled for dragging in search results.
 */
export default function Search({
  coursesInPlanner,
}: {
  coursesInPlanner: string[];
}) {
  const [department, setDepartment] = useState("");
  const [number, setNumber] = useState("");
  const [queryDetails, setQueryDetails] = useState({
    department: "",
    number: "",
  });
  const { data, loading } = useQuery(GET_COURSES, {
    variables: {
      department: queryDetails.department,
      number: nullIfNumberEmpty(queryDetails.number),
    },
  });

  const [departments, setDepartments] = useState([]);
  const { data: departmentsData } = useQuery(GET_DEPARTMENTS);
  type DepartmentType = {
    name: string;
  };
  useEffect(() => {
    if (departmentsData && departmentsData.departments) {
      setDepartments(
        departmentsData.departments.map((dep: DepartmentType) => dep.name),
      );
    }
  }, [departmentsData]);

  useDebounce({
    callback: () => handleSearch(department, number),
    delay: 500,
    dependencies: [department, number],
  });

  const handleChangeDepartment = (
    event: React.SyntheticEvent | null,
    newValue: string | null,
  ) => {
    setDepartment(newValue || "");
  };

  const handleChangeNumber = (number: string) => {
    setNumber(number.toString());
  };

  const handleSearch = (departmentInput: string, numberInput: string) => {
    setQueryDetails({
      department: departmentInput,
      number: numberInput.toUpperCase(),
    });
  };

  function courseIsAlreadyAdded(course: StoredCourse) {
    let alreadyAdded = false;
    coursesInPlanner.forEach((c) => {
      const [department, number] = c.split("-");
      if (department === course.department && number === course.number) {
        alreadyAdded = true;
      }
    });
    return alreadyAdded;
  }

  function nullIfNumberEmpty(number: string): string | null {
    return number.length > 0 ? number : null;
  }

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
          handleSearch(department, number);
        }}
      >
        <div className="grid grid-cols-2 gap-2 p-2">
          <Select
            placeholder="Department"
            name="department"
            aria-label="department"
            className="col-span-2"
            onChange={handleChangeDepartment}
            value={department}
            size="sm"
          >
            {departments.map((dep) => (
              <Option key={dep} value={dep}>
                {dep}
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
                    <CircularProgress variant="plain" color="neutral" />
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

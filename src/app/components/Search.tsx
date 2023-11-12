import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { Card, CircularProgress, Input, Option, Select } from "@mui/joy";
import { StoredCourse } from "../types/Course";
import CourseCard from "./CourseCard";
import { Droppable } from "@hello-pangea/dnd";
import { createIdFromCourse } from "../../lib/courseUtils";
import useDebounce from "../hooks/useDebounce";

// TODO: Base this on the actual departments in the database
const DEPARTMENTS = {
  CSE: "Computer Science and Engineering",
};

const GET_COURSE = gql`
  query getCourse($department: String!, $number: String = null) {
    coursesBy(department: $department, number: $number) {
      name
      department
      number
      credits
      quartersOffered
    }
  }
`;

/**
 * Component for searching for courses to add. `coursesAlreadyAdded` is a list of courses that have
 * already been added to the planner and should be disabled for dragging in search results.
 */
export default function Search({
  coursesInPlanner,
}: {
  coursesInPlanner: string[];
}) {
  const [department, setDepartment] = useState(getFirstKey(DEPARTMENTS));
  const [number, setNumber] = useState("");
  const [queryDetails, setQueryDetails] = useState({
    department: getFirstKey(DEPARTMENTS),
    number: "",
  });
  const { data, loading } = useQuery(GET_COURSE, {
    variables: {
      department: queryDetails.department,
      number: nullIfNumberEmpty(queryDetails.number),
    },
  });
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

  function getFirstKey(obj: any): string {
    return Object.keys(obj)[0];
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

  return (
    <Card className="w-64">
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
            defaultValue={getFirstKey(DEPARTMENTS)}
          >
            <Option
              value={getFirstKey(DEPARTMENTS)}
              aria-label="computer science and engineering"
            >
              {DEPARTMENTS["CSE"]}
            </Option>
          </Select>
          <Input
            className="col-span-2"
            color="neutral"
            placeholder="Number"
            size="md"
            variant="outlined"
            name="number"
            aria-label="number"
            onChange={(event) => handleChangeNumber(event.target.value)}
          />
        </div>
      </form>
      <Droppable droppableId={"search-droppable"} isDropDisabled={true}>
        {(provided) => {
          return (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {hasResults(data) ? (
                <div className="overflow-y-auto h-96">
                  {data.coursesBy.map((course: StoredCourse, index: number) => (
                    <CourseCard
                      key={index}
                      course={course}
                      index={index}
                      draggableId={createIdFromCourse(course) + "-search"}
                      alreadyAdded={courseIsAlreadyAdded(course)}
                      onDelete={undefined}
                    />
                  ))}
                  {provided.placeholder}
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

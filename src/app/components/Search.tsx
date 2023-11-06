import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { Button, Card, Input, Option, Select } from "@mui/joy";
import { Course, StoredCourse } from "../ts-types/Course";
import CourseCard from "./CourseCard";
import { Droppable } from "@hello-pangea/dnd";
import { createIdFromCourse } from "../../lib/courseUtils";

const CSE_DEPARTMENT = "Computer Science & Engineering";

const GET_COURSE = gql`
  query getCourse($department: String!, $number: String!) {
    coursesBy(department: $department, number: $number) {
      id
      name
      department
      number
      credits
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
  coursesInPlanner: StoredCourse[];
}) {
  const [department, setDepartment] = useState(CSE_DEPARTMENT);
  const [number, setNumber] = useState("");
  const [queryDetails, setQueryDetails] = useState({
    department: "",
    number: "",
  });
  const { data, loading, error } = useQuery(GET_COURSE, {
    variables: {
      department: queryDetails.department,
      number: queryDetails.number,
    },
    skip: false,
  });

  const handleChangeDepartment = (
    event: React.SyntheticEvent | null,
    newValue: string | null,
  ) => {
    setDepartment(newValue || "");
  };

  const handleSearch = (departmentInput: string, numberInput: string) => {
    setQueryDetails({
      department: departmentInput,
      number: numberInput.toUpperCase(),
    });
  };

  function courseIsAlreadyAdded(course: Course) {
    let alreadyAdded = false;
    coursesInPlanner.forEach((c) => {
      if (c.department === course.department && c.number === course.number) {
        alreadyAdded = true;
      }
    });
    return alreadyAdded;
  }

  return (
    <Card className="w-64 h-full">
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
            defaultValue={department}
          >
            <Option value="CSE" aria-label="computer science and engineering">
              {CSE_DEPARTMENT}
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
            onChange={(event) => setNumber(event.target.value)}
          />
        </div>
        <div className="px-2 pb-2">
          <Button
            className="w-full"
            aria-label="search"
            disabled={department == "" || number == ""}
            type="submit"
          >
            Search
          </Button>
        </div>
      </form>
      <Droppable droppableId={"search-droppable"}>
        {(provided, snapshot) => {
          return (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`${snapshot.isDraggingOver ? "bg-red-200" : ""}`}
            >
              {loading && <p>Loading...</p>}
              {error && <p>No results found</p>}
              {data ? (
                <div>
                  <div className="overflow-y-auto h-96">
                    {data.coursesBy.map((course: Course, index: number) => (
                      <CourseCard
                        key={index}
                        course={course}
                        index={index}
                        draggableId={createIdFromCourse(course) + "-search"}
                        alreadyAdded={courseIsAlreadyAdded(course)}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div>No results</div>
              )}
              {provided.placeholder}
            </div>
          );
        }}
      </Droppable>
    </Card>
  );
}

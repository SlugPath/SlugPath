import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { Button, Card, Input, Option, Select } from "@mui/joy";
import { StoredCourse } from "../ts-types/Course";
import CourseCard from "./CourseCard";
import { Droppable } from "@hello-pangea/dnd";
import { createIdFromCourse } from "../../lib/courseUtils";

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

export default function Search() {
  const [department, setDepartment] = useState("");
  const [number, setNumber] = useState("");

  const [search, setSearch] = useState(false);
  const [queryDetails, setQueryDetails] = useState({
    department: "",
    number: "",
  });

  const { data, loading, error } = useQuery(GET_COURSE, {
    variables: {
      department: queryDetails.department,
      number: queryDetails.number,
    },
    skip: !search, // Skip the query if search button hasn't been pressed yet
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
    setSearch(true);
  };

  return (
    <Card
      className="w-64"
      style={{
        height: "100%",
      }}
    >
      {/* Search form begins */}
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
          >
            <Option value="CSE" aria-label="computer science and engineering">
              Computer Science & Engineering
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
              style={{ height: "100%", minHeight: "48px" }}
              className={`${snapshot.isDraggingOver ? "bg-red-200" : ""}`}
            >
              {loading && <p>Loading...</p>}
              {error && <p>No results found</p>}
              {data ? (
                <div>
                  <div>
                    {data.coursesBy.map(
                      (course: StoredCourse, index: number) => (
                        <CourseCard
                          key={index}
                          course={course}
                          index={index}
                          draggableId={createIdFromCourse(course)}
                        />
                      ),
                    )}
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

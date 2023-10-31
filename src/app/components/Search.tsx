import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { Button, Input, Option, Select } from "@mui/joy";

const GET_COURSE = gql`
  query getCourse($department: String!, $number: String!) {
    coursesBy(department: $department, number: $number) {
      department
      number
      name
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
    <>
      {/* Search form begins */}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleSearch(department, number);
        }}
      >
        <div className="grid grid-cols-3 gap-2 p-2">
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
            className="col-span-1"
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
      {/* Search form ends */}

      {/* Results begins */}
      {loading && <p>Loading...</p>}
      {error && <p>No results found</p>}
      {data ? (
        data.coursesBy.length === 0 ? (
          <div>
            <p>No results found</p>
          </div>
        ) : (
          <div>
            <p>Department: {data.coursesBy[0].department}</p>
            <p>Number: {data.coursesBy[0].number}</p>
            <p>Name: {data.coursesBy[0].name}</p>
          </div>
        )
      ) : (
        <></>
      )}
      {/* Results ends */}
    </>
  );
}

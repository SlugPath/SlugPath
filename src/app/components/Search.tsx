
import { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { Button, Input, Option, Select } from '@mui/joy';

const GET_COURSE = gql`
  query getCourse($department: String!, $number: String!) {
    coursesBy (
      department: $department
      number: $number
    ) {
      department, number, name
    }
  }
`;

export default function Search() {

  const [search, setSearch] = useState(false);
  const [courseDetails, setCourseDetails] = useState({
    department: '',
    number: ''
  });

  const { data, loading, error } = useQuery(GET_COURSE, {
    variables: {
      department: courseDetails.department,
      number: courseDetails.number
    },
    skip: !search // Skip the query if search button hasn't been pressed yet
  });

  const handleSearch = (departmentInput: string, numberInput: string) => {
    setCourseDetails({department: departmentInput, number: numberInput.toUpperCase()});
    setSearch(true);
  }

  return (
    <>
      {/* Search form begins */}
      <form
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = (Object.fromEntries((formData as any).entries()));
            handleSearch(formJson.department, formJson.number);
          }}
        >
        <div className="w-72 grid grid-cols-3">
          <Select placeholder="Department" name="department" className="col-span-2">
            <Option value="CSE">Computer Science & Engineering</Option>
          </Select>
          <Input
            color="neutral"
            placeholder="Number"
            size="md"
            variant="outlined"
            name="number"
            className="col-span-1"
          />
        </div>
        <Button type="submit">Search</Button>
      </form>
      {/* Search form ends */}

      {/* Results begins */}
      {loading && <p>Loading...</p>}
      {error && <p>Please enter a valid course number</p>}
      {data ? (
        (data.coursesBy.length === 0) ? (
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
  )
}

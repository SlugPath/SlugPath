
// import { useState } from 'react';
import { gql, useQuery } from "@apollo/client";
import { Button, Input, Option, Select } from '@mui/joy';

export default function Search() {

  // const [course, setCourse] = useState({
  //   subject: "",
  //   operation: "",
  //   courseNumber: "",
  //   courseTitle: "",
  // });

  // FIXME: yoga returning multiple of the same class
  // const { data, loading, error } = useQuery(gql `
  //   query {
  //     coursesBy (
  //       department: ${course.subject},
  //       operation: ${course.operation},
  //       number: ${course.courseNumber},
  //       name: ${course.courseTitle},
  //     ) {
  //       department, number, name
  //   }
  // `);

  return (
    <div className="w-96 grid grid-rows-4 gap-2">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries((formData as any).entries());
          alert(JSON.stringify(formJson));
        }}
      >
        <Select placeholder="Department" name="department">
          {/* onChange={(e: any) => (setCourse(prevOptions => ({...prevOptions, subject: e.target.value})))}> */}
          <Option value="CSE">Computer Science & Engineering</Option>
        </Select>
        <div className="grid grid-cols-2">
          <Select placeholder="is exactly" defaultValue="is exactly" name="operation">
            {/* onChange={(e: any) => (setCourse(prevOptions => ({...prevOptions, operation: e.target.value})))}> */}
            <Option value="=">is exactly</Option>
            <Option value="<">less than or equal to</Option>
            <Option value=">">greater than or equal to</Option>
          </Select>
          {/* FIXME : ensure this is a numeric value - pop up error / don't allow submission */}
          <Input
            color="neutral"
            placeholder="Course Number"
            size="md"
            variant="outlined"
            type="number"
            name="number"
            // onChange={(e: any) => {
            //   setCourse(prevOptions => ({...prevOptions, courseNumber: e.target.value}));
            //   console.log(course);
            // }}
          />
        </div>
        <Input
          color="neutral"
          placeholder="Course Title Keyword"
          size="md"
          variant="outlined"
          name="name"
          // onChange={(e: any) => (setCourse(prevOptions => ({...prevOptions, courseTitle: e.target.value})))}
        />
        <Button type="submit">Search</Button>
      </form>
    </div>
  )
}

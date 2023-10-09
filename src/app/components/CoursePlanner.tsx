import { Card } from "@mui/joy";
import { gql, useQuery } from '@apollo/client'
import QuarterCard from "./QuarterCard";
import { Member } from "../../graphql/member/schema";
import * as React from 'react'

const quarterNames = ["Fall", "Winter", "Spring"];
const yearNames = ["Freshman", "Sophomore", "Junior", "Senior"];

const AllMembers = gql`
  query members {
    member {
      name
      email
    }
  }
`;

function quarterComponents() {
  return (
    <div className="flex flex-row space-x-4">
      {quarterNames.map((quarter, index) => (
        <div key={index}>
          <QuarterCard title={quarter} />
        </div>
      ))}
    </div>
  );
}

function yearComponents() {
  return (
    <div className="flex flex-col space-y-2">
      {yearNames.map((year, index) => (
        <div key={index}>
          {year + " Year"}
          {quarterComponents()}
        </div>
      ))}
    </div>
  );
}

export function CoursePlanner() {
  const { data, loading, error } = useQuery(AllMembers)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Oh no... {error.message}</p>

  return (
    <div className="flex min-h-screen flex-col items-center space-between p-24 bg-gray-100 space-y-4">
      <div className="grid place-items-center py-10 gap-2">
        <div id="members" className="text-3xl pb-3">Meet the team members!</div>
        {data.member.map((member: Member) => (
          <div
            key={member.name}
            className="grid grid-cols-2 place-items-center"
          >
            <div className="col-span-1">{member.name}</div>
            <div className="col-span-1">{member.email}</div>
          </div>
        ))}
      </div>
      <Card className="flex flex-row">
        {yearComponents()}
      </Card>
    </div>
  );
}

export default CoursePlanner;


import { Member } from "../graphql/member/schema";
import CoursePlanner from "./components/CoursePlanner";

async function getMembers(): Promise<Member[]> {
  let query = '';

  // Retrieving information about team members
  query = 'query member {member { name, email }}';

  const url = process.env.GRAPHQL_URL || "http://localhost:3000/graphql"
  const resMembers = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({ query }),
  })
  const jsonMembers = await resMembers.json();

  // Returning a list of objects with member information
  return await jsonMembers.data.member;
}

export default async function Home() {
  const members = await getMembers();
  return (
    <main>
      <div className="grid place-items-center py-10 gap-2">
        <div className="text-3xl pb-3">Meet the team members!</div>
        {members.map((member) => (
          <div key={member.name} className="grid grid-cols-2 place-items-center">
            <div className="col-span-1">{member.name}</div>
            <div className="col-span-1">{member.email}</div>
          </div>
        ))}
      </div>
      <CoursePlanner />
    </main>
  )
}


import { Member } from "../graphql/member/schema";
import CoursePlanner from "./components/CoursePlanner";

async function getMembers(): Promise<Member[]> {
  let query = '';

  // Retrieving the total number of slack users
  query = 'query member {member { id, name, email }}';

  const resMembers = await fetch('http://localhost:3000/api/graphql', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({ query }),
  })
  const jsonMembers = await resMembers.json();
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

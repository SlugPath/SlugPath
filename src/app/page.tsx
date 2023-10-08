import { Member } from "../graphql/member/schema";
import CoursePlanner from "./components/CoursePlanner";

async function getMembers(): Promise<Member[]> {
  // Retrieving information about team members
  const query = 'query member {member { name, email }}';

  const url = process.env.GRAPHQL_URL || "http://localhost:3000/api/graphql";
  const resMembers = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({query}),
  });
  try {
    const jsonMembers = await resMembers.json();
    return await jsonMembers.data.member;
  } catch (e) {
    console.error(e);
    return [];
  }

  // Returning a list of objects with member information
}

export default async function Home() {
  const members = await getMembers();
  return (
    <main>
      <div className="grid place-items-center py-10 gap-2">
        <div className="text-3xl pb-3">Meet the team members!</div>
        {members.map((member) => (
          <div
            key={member.name}
            className="grid grid-cols-2 place-items-center"
          >
            <div className="col-span-1">{member.name}</div>
            <div className="col-span-1">{member.email}</div>
          </div>
        ))}
      </div>
      <CoursePlanner />
    </main>
  );
}

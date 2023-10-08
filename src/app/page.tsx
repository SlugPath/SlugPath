"use client";

import { useEffect, useState } from "react";
import { Member } from "../graphql/member/schema";
import CoursePlanner from "./components/CoursePlanner";

async function fetchMembers(): Promise<Member[]>{
  // Retrieving information about team members
  const query = "query member {member { name, email }}";

  const prodHost = process.env.VERCEL_URL;
  console.log(`prodHost is ${prodHost}`)
  const defaultUrl = "http://localhost:3000/api/graphql";
  const url = prodHost ? `https://${prodHost}/api/graphql` : defaultUrl;
  console.log(`url is ${url}`);

  const resMembers = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  try {
    const jsonMembers = await resMembers.json();
    return jsonMembers.data.member;
  } catch (e) {
    console.error(e);
    return [];
  }
}

function Members() {
  const [members, setMembers] = useState<Member[]>([]);
  useEffect(() => {
    fetchMembers().then((it: Member[]) => setMembers(it))
  }, [])

  if (members.length == 0) {
    return (
      <h2>Loading....</h2>
    )
  }
  return (
    <>
      <div id="members" className="text-3xl pb-3">Meet the team members!</div>
      {members.map((member) => (
        <div
          key={member.name}
          className="grid grid-cols-2 place-items-center"
        >
          <div className="col-span-1">{member.name}</div>
          <div className="col-span-1">{member.email}</div>
        </div>
      ))}
    </>
  );
}

export default function Home() {
  return (
    <main>
      <div className="grid place-items-center py-10 gap-2">
        <Members />
      </div>
      <CoursePlanner />
    </main>
  );
}

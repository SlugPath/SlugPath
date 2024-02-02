import Planners from "@components/planners/Planners";
import { getServerSession } from "next-auth";

import { getAllPlanners } from "../actions/planner";

export default async function Home() {
  const session = await getServerSession();
  const planners = await getAllPlanners(session?.user.email ?? "");

  return <Planners planners={planners} />;
}

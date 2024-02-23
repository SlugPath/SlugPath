import { getAllPlanners } from "@actions/planner";
import Planners from "@components/planners/Planners";
import { getServerSession } from "next-auth";

export default async function Home() {
  const session = await getServerSession();

  const planners = await getAllPlanners(session?.user.email ?? "");
  return <Planners planners={planners} />;
}

import Planners from "@components/planners/Planners";
import { getServerSession } from "next-auth";

import { getAllPlanners } from "../actions/planner";
import { PlannerData } from "../types/Planner";

export default async function Home() {
  const session = await getServerSession();

  let planners: PlannerData[];
  try {
    planners = await getAllPlanners(session?.user.email ?? "");
  } catch (e) {
    planners = [];
  }

  return <Planners planners={planners} />;
}

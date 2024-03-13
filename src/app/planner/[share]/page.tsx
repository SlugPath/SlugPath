import { PlannerData } from "@/app/types/Planner";
import { authOptions } from "@/lib/auth";
import { clonePlanner } from "@/lib/plannerUtils";
import {
  getAllPlanners,
  getPlannerById,
  saveAllPlanners,
} from "@actions/planner";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export default async function Page({ params }: { params: { share: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  const planners = await getAllPlanners(session?.user.email ?? "");

  // Share planner part
  const sharedPlanner = await getPlannerById(params.share);
  if (!sharedPlanner) redirect("/planner");

  // clone the planner
  const duplicatePlanner: PlannerData = {
    ...clonePlanner(sharedPlanner),
    id: uuidv4(),
  };

  // update the title of the new planner
  duplicatePlanner.title = "Shared: " + duplicatePlanner.title;

  planners.push(duplicatePlanner);

  // save it
  await saveAllPlanners({
    userId: session?.user.id ?? "",
    planners,
  });
  redirect("/planner");
}

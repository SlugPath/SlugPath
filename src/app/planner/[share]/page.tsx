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
  console.log("In Share");
  console.log("share id = " + params.share);

  const session = await getServerSession(authOptions);
  const planners = await getAllPlanners(session?.user.email ?? "");

  // Share planner part
  const sharedPlanner = await getPlannerById(params.share);

  // clone the planner
  console.log(`Old planner id: ${sharedPlanner.id}`);
  const duplicatePlanner: PlannerData = {
    ...clonePlanner(sharedPlanner),
    id: uuidv4(),
  };

  // update the title of the new planner
  duplicatePlanner.title = "Shared: "  + duplicatePlanner.title

  console.log(`New planner id: ${duplicatePlanner.id}`);
  console.log(`
    ============================================================
    ORIGINAL PLANNER\n\n ${JSON.stringify(sharedPlanner, null, 2)}}`);
  console.log(`
    =============================================================
    DUPLICATED PLANNER\n\n${JSON.stringify(duplicatePlanner, null, 2)}}`);

  planners.push(duplicatePlanner);

  console.log(`user id: ${session?.user.id}`);
  // console.log(`planners: ${JSON.stringify(planners, null, 2)}`)

  // save it
  await saveAllPlanners({
    userId: session?.user.id ?? "",
    planners,
  });

  // set it to the active planner ?

  // End share

  console.log("/share test");

  redirect("/planner");
}

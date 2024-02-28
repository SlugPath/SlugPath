import Planners from "@components/planners/Planners";
import { getServerSession } from "next-auth";

import { getAllPlanners, getPlannerById, saveAllPlanners } from "../../actions/planner";

import { clonePlanner } from "@/lib/plannerUtils";

import { authOptions } from "@/lib/auth";




export default async function Page({ params }: { params: { share: string } }) {
  console.log("In Share")
  console.log("Slug = " + params.share)

  const session = await getServerSession(authOptions);

  const planners = await getAllPlanners(session?.user.email ?? "");



  // Share planner part


  let sharedPlanner = await getPlannerById(params.share)

  // clone the planner
  let duplicatePlanner = await clonePlanner(sharedPlanner)

  planners.unshift(duplicatePlanner)

  console.log(`user: ${session?.user.id}`)
  console.log(`planners: ${planners}`)

  
  // save it
  let temp = await saveAllPlanners({
    userId: session?.user.id ?? "",
    planners: planners,
  });

  console.log(`temp: ${temp}`)


  // set it to the active planner ?

  // End share
  

  console.log("/share test")
  return <Planners planners={planners}/>;
}
import Planners from "@components/planners/Planners";
import { getServerSession } from "next-auth";

import { getAllPlanners, getPlannerById, saveAllPlanners } from "../../actions/planner";

import { clonePlanner } from "@/lib/plannerUtils";

import { authOptions } from "@/lib/auth";

import { v4 as uuidv4 } from "uuid";

import { redirect } from "next/navigation";




export default async function Page({ params }: { params: { share: string } }) {
  console.log("In Share")
  console.log("share id = " + params.share)

  const session = await getServerSession(authOptions);

  const planners = await getAllPlanners(session?.user.email ?? "");



  // Share planner part


  let sharedPlanner = await getPlannerById(params.share)

  // clone the planner
  let duplicatePlanner = clonePlanner(sharedPlanner)


  // give the clone a new ID
  console.log(`Old planner id: ${duplicatePlanner.id}`)


  let newId = uuidv4()
  duplicatePlanner.id = newId

  console.log(`New planner id: ${duplicatePlanner.id}`)


  // console.log(`planners before: ${planners}`)

  console.log(`ORIGINAL PLANNER\n\n${JSON.stringify(sharedPlanner, null, 2)}}`)
  console.log(`DUPLICATED PLANNER\n\n${JSON.stringify(duplicatePlanner, null, 2)}}`)

  planners.push(duplicatePlanner)

  console.log(`user id: ${session?.user.id}`)
  // console.log(`planners: ${JSON.stringify(planners, null, 2)}`)

  
  // save it
  let temp = await saveAllPlanners({
    userId: session?.user.id ?? "",
    planners: planners,
  });

  console.log(`temp: ${temp}`)


  // set it to the active planner ?

  // End share
  

  console.log("/share test")

  redirect("/planner");

}
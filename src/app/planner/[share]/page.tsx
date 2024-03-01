import Planners from "@components/planners/Planners";
import { getServerSession } from "next-auth";

import { createPlanner, getAllPlanners, getPlannerById, saveAllPlanners } from "../../actions/planner";

import { clonePlanner } from "@/lib/plannerUtils";

import { authOptions } from "@/lib/auth";

import { v4 as uuidv4 } from "uuid";

import { redirect } from "next/navigation";

// import { client } from "@/lib/prisma"




export default async function Page({ params }: { params: { share: string } }) {
  console.log("In Share")
  console.log("share id = " + params.share)

  const session = await getServerSession(authOptions);

  const planners = await getAllPlanners(session?.user.email ?? "");

  const userId = session?.user.id ?? ""



  // Share planner part


  const sharedPlanner = await getPlannerById(params.share)

  // clone the planner
  const duplicatePlanner = clonePlanner(sharedPlanner)


  // give the clone a new ID
  console.log(`Old planner id: ${duplicatePlanner.id}`)


  const newId = uuidv4()
  duplicatePlanner.id = newId
  duplicatePlanner.title = "Copy of " + duplicatePlanner.title

  console.log(`New planner id: ${duplicatePlanner.id}`)


  // console.log(`planners before: ${planners}`)

  console.log(`ORIGINAL PLANNER\n\n${JSON.stringify(sharedPlanner, null, 2)}}`)
  console.log(`DUPLICATED PLANNER\n\n${JSON.stringify(duplicatePlanner, null, 2)}}`)

  planners.push(duplicatePlanner)

  console.log(`user id: ${userId}`)
  // console.log(`planners: ${JSON.stringify(planners, null, 2)}`)

  
  // save it

  const temp = await saveAllPlanners({
    userId: userId ?? "",
    planners: planners,
  });

  console.log(`OUTPUT OF SAVEALLPLANNERS: ${temp}`)

  // let temp = createPlanner(client, {userId, newId, duplicatePlanner, duplicatePlanner.title, duplicatePlanner.order})


  // set it to the active planner ?

  // End share
  

  console.log("/share test")

  redirect("/planner");



}
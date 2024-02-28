import Planners from "@components/planners/Planners";
import { getServerSession } from "next-auth";

import { getAllPlanners, getPlannerById, saveAllPlanners } from "../../actions/planner";
import { useContext } from "react";

import { PlannersContext } from "@/app/contexts/PlannersProvider";

import { usePlanners } from "@/app/components/planners/usePlanners";

import { v4 as uuidv4 } from "uuid";
import { clonePlanner } from "@/lib/plannerUtils";
import { PlannerData } from "@/app/types/Planner";
import { DeleteBucketReplicationCommand } from "@aws-sdk/client-s3";



export default async function Page({ params }: { params: { share: string } }) {
  console.log("In Share")
  console.log("Slug = " + params.share)

  const session = await getServerSession();

  const planners = await getAllPlanners(session?.user.email ?? "");



  // Share planner part


  let sharedPlanner = await getPlannerById(params.share)

  // clone the planner
  let duplicatePlanner = await clonePlanner(sharedPlanner)

  planners.unshift(duplicatePlanner)
  
  // save it
  await saveAllPlanners({
    userId: session?.user.email ?? "",
    planners: planners,
  });

  // set it to the active planner ?

  // End share
  

  console.log("/share test")
  return <Planners planners={planners}/>;
}
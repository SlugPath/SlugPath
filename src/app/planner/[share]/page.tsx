import Planners from "@components/planners/Planners";
import { getServerSession } from "next-auth";

import { getAllPlanners, getPlannerById } from "../../actions/planner";
import { useContext } from "react";

import { PlannersContext } from "@/app/contexts/PlannersProvider";

import { usePlanners } from "@/app/components/planners/usePlanners";

import { v4 as uuidv4 } from "uuid";
import { clonePlanner } from "@/lib/plannerUtils";
import useLocalStorage from "@/app/hooks/useLocalStorage";
import { PlannerData } from "@/app/types/Planner";



export default async function Page({ params }: { params: { share: string } }) {
  console.log("In Share")
  console.log("Slug = " + params.share)

  const session = await getServerSession();

  const planners = await getAllPlanners(session?.user.email ?? "");



  const setPlanners = useLocalStorage<PlannerData[]>(
    "planners",
    planners,
  );

  // Share planner part


  let sharedPlanner = await getPlannerById(params.share)

  // clone the planner
  let duplicatePlanner = clonePlanner(sharedPlanner)
  
  const [activePlanner, setActivePlanner] = useLocalStorage<string | undefined>(
    "activePlanner",
    planners[0]?.id,
  );

  // set it to the active planner
  setActivePlanner(params.share)

  // End share
  

  console.log("/share test")
  return <Planners planners={planners}/>;
}
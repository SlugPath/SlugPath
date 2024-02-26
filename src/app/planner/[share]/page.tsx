import Planners from "@components/planners/Planners";
import { getServerSession } from "next-auth";

import { getAllPlanners } from "../../actions/planner";
import { useContext } from "react";

import { PlannersContext } from "@/app/contexts/PlannersProvider";

import { usePlanners } from "@/app/components/planners/usePlanners";


export default async function Page({ params }: { params: { share: string } }) {
    console.log("In Share")
    console.log("Slug = " + params.share)

    const session = await getServerSession();

    const planners = await getAllPlanners(session?.user.email ?? "");


    
  
    console.log("/share test")
    return <Planners planners={planners} isShare={true}/>;
  }
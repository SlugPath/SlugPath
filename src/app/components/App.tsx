"use client";
import { List, ListItem } from "@mui/joy";
import Planner from "./Planner";
import PlannerTabs from "./PlannerTabs";
import Navbar from "./Navbar";
import { useContext, useEffect } from "react";
import {
  PlannersContext,
  PlannersProvider,
} from "../contexts/PlannersProvider";
import { PlannerProvider } from "../contexts/PlannerProvider";
import { DefaultPlannerProvider } from "../contexts/DefaultPlannerProvider";
import UnauthenticatedWarning from "./UnauthenticatedWarning";
import { useSession } from "next-auth/react";
import useMajorSelection from "../hooks/useMajorSelection";
import { useRouter } from "next/navigation";
import BetaWarning from "./beta/BetaWarning";

export default function App() {
  return (
    <DefaultPlannerProvider>
      <PlannersProvider>
        <div className="h-full min-h-screen w-full bg-bg-light dark:bg-bg-dark flex flex-col justify-between">
          <Navbar />
          <BetaWarning />
          <div className="pt-4 mb-auto">
            <div className="flex justify-left px-7">
              <PlannerTabs />
            </div>
            <div className="px-5">
              <PlannerList />
            </div>
          </div>
        </div>
      </PlannersProvider>
    </DefaultPlannerProvider>
  );
}

function PlannerList() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { planners } = useContext(PlannersContext);
  const { userMajorData, loadingMajorData } = useMajorSelection(
    session?.user.id,
  );

  useEffect(() => {
    function shouldRedirectToMajorSelectionPage(): boolean {
      return (
        status === "authenticated" &&
        !loadingMajorData &&
        userMajorData === null
      );
    }

    if (shouldRedirectToMajorSelectionPage()) {
      router.push("/");
    }
  }, [userMajorData, loadingMajorData, status, router]);

  return (
    <>
      {Object.keys(planners).length == 0 && <HelpfulTips status={status} />}
      <List>
        {Object.keys(planners).map((id, index) => (
          <ListItem
            sx={{ display: planners[id][1] ? "block" : "none" }}
            key={id}
          >
            <PlannerProvider
              plannerId={id}
              title={planners[id][0]}
              order={index}
            >
              <Planner isActive={planners[id][1]} />
            </PlannerProvider>
          </ListItem>
        ))}
      </List>
    </>
  );
}

const HelpfulTips = (status: any) => {
  return (
    <div className="flex flex-col items-center justify-center h-[90vh] text-secondary-900 dark:text-secondary-200">
      <div className="text-lg text-center">
        Click the <b>+</b> button above to create a new planner.
      </div>
      {status !== "authenticated" ? (
        <div className="space-y-2 grid place-items-center">
          <UnauthenticatedWarning />
        </div>
      ) : null}
    </div>
  );
};

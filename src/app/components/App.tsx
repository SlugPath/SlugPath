"use client";
import { CssVarsProvider, List, ListItem } from "@mui/joy";
import Planner from "./planner/Planner";
import PlannerTabs from "./planners/plannerTabs/PlannerTabs";
import Navbar from "./navbar/Navbar";
import { useContext, useState, useEffect } from "react";
import {
  PlannersContext,
  PlannersProvider,
} from "../contexts/PlannersProvider";
import { PlannerProvider } from "../contexts/PlannerProvider";
import { DefaultPlannerProvider } from "../contexts/DefaultPlannerProvider";
import UnauthenticatedWarning from "./modals/UnauthenticatedWarning";
import { useSession } from "next-auth/react";
import useMajorSelection from "./majorSelection/useMajorSelection";
import { useRouter } from "next/navigation";
import BetaWarning from "./beta/BetaWarning";
import DeletedPlannerSnackbar from "./planners/plannerTabs/DeletedPlannerSnackbar";

export default function App() {
  return (
    <DefaultPlannerProvider>
      <PlannersProvider>
        <CssVarsProvider defaultMode="system">
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
        </CssVarsProvider>
      </PlannersProvider>
    </DefaultPlannerProvider>
  );
}

function PlannerList() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { planners, deletedPlanner, loadingDeletePlanner, activePlanner } =
    useContext(PlannersContext);
  const [openDeletedPlannerSnackbar, setOpenDeletedPlannerSnackbar] =
    useState(false);

  useEffect(() => {
    if (deletedPlanner) {
      setOpenDeletedPlannerSnackbar(true);
    }
  }, [deletedPlanner, loadingDeletePlanner]);

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
        {planners.map(({ id, title }, index) => (
          <ListItem
            sx={{ display: activePlanner === id ? "block" : "none" }}
            key={id}
          >
            <PlannerProvider plannerId={id} title={title} order={index}>
              <Planner isActive={activePlanner === id} />
            </PlannerProvider>
          </ListItem>
        ))}
      </List>
      <DeletedPlannerSnackbar
        open={openDeletedPlannerSnackbar}
        setOpen={setOpenDeletedPlannerSnackbar}
      />
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

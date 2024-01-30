"use client";

import { PlannerProvider } from "@contexts/PlannerProvider";
import { List, ListItem } from "@mui/joy";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

import { PlannersContext } from "../contexts/PlannersProvider";
import useConfirmPageLeave from "../hooks/useConfirmPageLeave";
import useMajorSelection from "./majorSelection/useMajorSelection";
import Planner from "./planner/Planner";
import DeletedPlannerSnackbar from "./planners/plannerTabs/DeletedPlannerSnackbar";
import PlannerTabs from "./planners/plannerTabs/PlannerTabs";

export default function App() {
  const { status } = useSession();
  useConfirmPageLeave(status === "unauthenticated");
  return (
    <div className="pt-4 mb-auto">
      <div className="flex justify-left px-7">
        <PlannerTabs />
      </div>
      <div className="px-5">
        <PlannerList />
      </div>
    </div>
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

  if (planners.length == 0) return <HelpfulTips />;

  return (
    <>
      <List>
        {planners.map(({ id, title }, index) => (
          <ListItem
            sx={{
              display: activePlanner === id ? "block" : "none",
            }}
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

const HelpfulTips = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[90vh] text-secondary-900 dark:text-secondary-200">
      <div className="text-lg text-center">
        Click the <b>+</b> button above to create a new planner ✏️.
      </div>
    </div>
  );
};

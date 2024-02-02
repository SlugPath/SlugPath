"use client";

import { PlannerProvider } from "@/app/contexts/PlannerProvider";
import { PlannersContext } from "@/app/contexts/PlannersProvider";
import { List, ListItem } from "@mui/joy";
import { useContext, useEffect, useState } from "react";

import Planner from "../planner/Planner";
import DeletedPlannerSnackbar from "./plannerTabs/DeletedPlannerSnackbar";

export default function PlannerList() {
  const { planners, deletedPlanner, loadingDeletePlanner, activePlanner } =
    useContext(PlannersContext);
  const [openDeletedPlannerSnackbar, setOpenDeletedPlannerSnackbar] =
    useState(false);

  useEffect(() => {
    if (deletedPlanner) {
      setOpenDeletedPlannerSnackbar(true);
    }
  }, [deletedPlanner, loadingDeletePlanner]);

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
        Click the <b>+</b> button above to create a new planner ✏️
      </div>
    </div>
  );
};

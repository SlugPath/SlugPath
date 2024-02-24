"use client";

import { MajorVerificationProvider } from "@contexts/MajorVerificationProvider";
import { PlannerProvider } from "@contexts/PlannerProvider";
import { PlannersContext } from "@contexts/PlannersProvider";
import { List, ListItem } from "@mui/joy";
import { useContext } from "react";

import Planner from "../planner/Planner";

export default function PlannerList() {
  const { planners, activePlanner } = useContext(PlannersContext);

  if (!planners || planners.length == 0) return <HelpfulTips />;

  return (
    <>
      <List>
        {planners?.map(({ id, title }, index) => (
          <ListItem
            sx={{
              display: activePlanner === id ? "block" : "none",
            }}
            key={id}
          >
            <MajorVerificationProvider>
              <PlannerProvider plannerId={id} title={title} order={index}>
                <Planner isActive={activePlanner === id} />
              </PlannerProvider>
            </MajorVerificationProvider>
          </ListItem>
        ))}
      </List>
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

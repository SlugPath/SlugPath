"use client";

import {
  PlannerContext,
  PlannerProvider,
} from "@/app/contexts/PlannerProvider";
import { PlannerData } from "@/app/types/Planner";
import usePlannersStore from "@/store/planner";
import { Menu } from "@mui/icons-material";
import { Drawer, IconButton, List, ListItemButton } from "@mui/joy";
import { useRouter } from "next/navigation";
import { useContext, useMemo, useState } from "react";

import UserAvatarButton from "../buttons/UserAvatarButton";
import { GraduationProgressCard } from "../planner/Planner";

export default function MobileMenu() {
  const [openMenu, setOpenMenu] = useState(false);
  const [openGrad, setOpenGrad] = useState(false);
  const router = useRouter();
  const planners = usePlannersStore((state) => state.planners);
  const setPlanner = usePlannersStore((state) => state.setPlanner);
  const activePlannerId = usePlannersStore((state) => state.activePlannerId);
  const handleMajorMinorPageOpen = () => {
    router.push("/planner/majors");
    setOpenMenu(false);
  };
  const activePlanner = useMemo(
    () => planners.find((planner) => planner.id === activePlannerId),
    [planners, activePlannerId],
  );

  if (!planners || planners.length == 0) return null;

  if (!activePlanner) {
    throw new Error("Active planner not found");
  }

  return (
    <div>
      <IconButton
        className="text-secondary-100 dark:text-secondary-200 hover:bg-primary-400"
        variant="solid"
        onClick={() => setOpenMenu(true)}
      >
        <Menu />
      </IconButton>
      <Drawer anchor="right" open={openMenu} onClose={() => setOpenMenu(false)}>
        <List
          size="lg"
          component="nav"
          sx={{
            "& > div": { justifyContent: "center" },
          }}
        >
          <UserAvatarButton image=""></UserAvatarButton>
          <ListItemButton onClick={handleMajorMinorPageOpen}>
            Majors & Minors
          </ListItemButton>
          <ListItemButton onClick={() => setOpenGrad(true)}>
            Graduation Progress
          </ListItemButton>
        </List>
        <Drawer
          anchor="right"
          open={openGrad}
          onClose={() => setOpenGrad(false)}
        >
          {planners.map(({ id }) => (
            <div key={id}>
              <PlannerProvider
                planner={activePlanner}
                setPlanner={(newPlanner: PlannerData) =>
                  setPlanner(activePlanner.id, newPlanner)
                }
              >
                <MobileGradProgress
                  isActive={activePlannerId === id}
                ></MobileGradProgress>
              </PlannerProvider>
            </div>
          ))}
        </Drawer>
      </Drawer>
    </div>
  );
}

function MobileGradProgress({ isActive }: { isActive: boolean }) {
  const { totalCredits, geSatisfied, courseState } = useContext(PlannerContext);

  if (!isActive) {
    return <></>;
  }

  return (
    <GraduationProgressCard
      totalCredits={totalCredits}
      geSatisfied={geSatisfied}
      courseState={courseState}
    />
  );
}

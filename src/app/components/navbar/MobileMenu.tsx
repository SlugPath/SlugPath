"use client";

import { PlannerContext } from "@/app/contexts/PlannerProvider";
import { Menu } from "@mui/icons-material";
import { Drawer, IconButton, List, ListItemButton } from "@mui/joy";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";

import UserAvatarButton from "../buttons/UserAvatarButton";
import { GraduationProgressCard } from "../planner/Planner";

export default function MobileMenu() {
  const [openMenu, setOpenMenu] = useState(false);
  const [openGrad, setOpenGrad] = useState(false);
  const router = useRouter();
  const { totalCredits, geSatisfied, courseState } = useContext(PlannerContext);

  const handleMajorMinorPageOpen = () => {
    router.push("/planner/majors");
    setOpenMenu(false);
  };

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
          <GraduationProgressCard
            totalCredits={totalCredits}
            geSatisfied={geSatisfied}
            courseState={courseState}
          />
        </Drawer>
      </Drawer>
    </div>
  );
}

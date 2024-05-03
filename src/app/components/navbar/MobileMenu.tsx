"use client";

import {
  PlannerContext,
  PlannerProvider,
} from "@/app/contexts/PlannerProvider";
import { PlannerData } from "@/app/types/Planner";
import usePlannersStore from "@/store/planner";
import { Menu } from "@mui/icons-material";
import DonutLargeIcon from "@mui/icons-material/DonutLarge";
import SchoolIcon from "@mui/icons-material/School";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemDecorator,
  ModalClose,
  Typography,
} from "@mui/joy";
import { useRouter } from "next/navigation";
import { useContext, useMemo, useState } from "react";

import UserAvatar from "../miscellaneous/UserAvatar";
import { GraduationProgressCard } from "../planner/Planner";

interface MobileMenuProps {
  image: string;
  name?: string | null;
  email?: string | null;
}

export default function MobileMenu({ image, name, email }: MobileMenuProps) {
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
        <Box
          sx={{
            backgroundColor: "#e2e8f0",
          }}
        >
          <ModalClose id="close-icon" />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
              p: 1.5,
              pb: 2,
              mt: 4,
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <UserAvatar image={image} size="lg" />
            {name !== null && <Typography level="title-lg">{name}</Typography>}
            {email !== null && <Typography level="body-md">{email}</Typography>}
          </Box>
        </Box>
        <List size="lg" component="nav">
          <ListItemButton
            onClick={handleMajorMinorPageOpen}
            sx={{ fontWeight: "bold", fontSize: "1rem" }}
          >
            <ListItemDecorator>
              <SchoolIcon />
            </ListItemDecorator>
            Majors & Minors
          </ListItemButton>
          <ListItemButton
            onClick={() => setOpenGrad(true)}
            sx={{ fontWeight: "bold", fontSize: "1rem" }}
          >
            <ListItemDecorator>
              <DonutLargeIcon />
            </ListItemDecorator>
            Graduation Progress
          </ListItemButton>
        </List>

        {/* Graduation Progress Drawer */}
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

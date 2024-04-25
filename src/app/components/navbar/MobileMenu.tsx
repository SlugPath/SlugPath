"use client";

import { Menu } from "@mui/icons-material";
import { Drawer, IconButton, List, ListItemButton } from "@mui/joy";
import { useState } from "react";

import UserAvatarButton from "../buttons/UserAvatarButton";

export default function MobileMenu() {
  const [openMenu, setOpenMenu] = useState(false);
  const [openGrad, setOpenGrad] = useState(false);
  const [openMajMin, setOpenMajMin] = useState(false);

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
          <ListItemButton onClick={() => setOpenMajMin(true)}>
            Majors & Minors
          </ListItemButton>
          <ListItemButton onClick={() => setOpenGrad(true)}>
            Graduation Progress
          </ListItemButton>
        </List>
        <Drawer
          anchor="right"
          open={openMajMin}
          onClose={() => setOpenMajMin(false)}
        >
          TODO
        </Drawer>
        <Drawer
          anchor="right"
          open={openGrad}
          onClose={() => setOpenGrad(false)}
        >
          TODO
        </Drawer>
      </Drawer>
    </div>
  );
}

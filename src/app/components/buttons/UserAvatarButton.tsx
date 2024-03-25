"use client";

import { Dropdown, Menu, MenuButton, MenuItem } from "@mui/joy";
import { signOut } from "next-auth/react";

import UserAvatar from "../miscellaneous/UserAvatar";

export default function UserAvatarButton({ image }: { image: string }) {
  return (
    <Dropdown>
      <MenuButton color="neutral" variant="plain" size="sm">
        <UserAvatar image={image} />
      </MenuButton>
      <Menu variant="soft">
        <MenuItem
          onClick={() => {
            signOut();
          }}
        >
          Sign out
        </MenuItem>
      </Menu>
    </Dropdown>
  );
}

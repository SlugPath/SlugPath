import { Dropdown, Menu, MenuItem } from "@mui/joy";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button, MenuButton } from "@mui/joy";
import UserAvatar from "./UserAvatar";

export default function LoginButton() {
  const { data: session, status } = useSession();

  return (
    <div>
      {status !== "authenticated" ? (
        <Button
          variant="outlined"
          onClick={() => {
            signIn("google");
          }}
          className="text-light-text dark:text-light-secondary-text hover:bg-hover-blue"
        >
          Login with UCSC account
        </Button>
      ) : (
        <Dropdown>
          <MenuButton color="neutral" variant="plain" size="sm">
            <UserAvatar name={session.user?.name} />
          </MenuButton>
          <Menu variant="soft">
            <MenuItem
              onClick={() => {
                localStorage.clear();
                signOut();
              }}
            >
              Sign out
            </MenuItem>
          </Menu>
        </Dropdown>
      )}
    </div>
  );
}

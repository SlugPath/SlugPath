import { Dropdown, Menu, MenuItem } from "@mui/joy";
import { Button, MenuButton } from "@mui/joy";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import UserAvatar from "../UserAvatar";

export default function LoginButton() {
  const { data: session, status } = useSession();
  const { replace } = useRouter();

  return (
    <div>
      {status !== "authenticated" ? (
        <Button
          variant="solid"
          onClick={() => {
            signIn("google");
          }}
          className="text-secondary-100 dark:text-secondary-200 hover:bg-primary-400"
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
                signOut();
                replace("/");
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

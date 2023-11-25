import { Button, Dropdown, MenuButton, Menu, MenuItem } from "@mui/joy";
import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import UserAvatar from "./UserAvatar";
export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    // <header className="bg-white w-full">
    <header className="bg-blue-500 w-full">
      <nav className={`${status !== "authenticated" ? "py-1.5" : "py-0"} px-5`}>
        <div className="flex flex-row">
          {/* Logo and title start */}
          <div className="flex flex-row gap-4 place-items-center pr-2">
            <Image
              src="/images/slug-icon.png"
              width={30}
              height={30}
              alt="Slug Icon"
            />
            {/* <a href="#" className="text-xl font-semibold text-gray-800"> */}
            <a href="#" className="text-xl font-semibold text-white">
              UCSC Course Planner
            </a>
          </div>
          {/* Logo and title end */}

          {/* Login button start */}
          <div className="flex flex-1 justify-end">
            {status !== "authenticated" ? (
              <Button
                variant="solid"
                onClick={() => {
                  signIn("google");
                }}
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
          {/* Buttons end */}
        </div>
      </nav>
    </header>
  );
}

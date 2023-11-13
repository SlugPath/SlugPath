import { Button, Dropdown, MenuButton, Menu, MenuItem } from "@mui/joy";
import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import UserAvatar from "./UserAvatar";

export default function Navbar({
  setShowExportModal,
  setShowMajorCompletionModal,
}: {
  setShowExportModal: any;
  setShowMajorCompletionModal: any;
}) {
  const { data: session, status } = useSession();

  return (
    <header className="bg-white w-full shadow-md">
      <nav className="py-3 px-5">
        <div className="flex flex-row">
          {/* Logo and title start */}
          <div className="flex flex-row gap-4 place-items-center pr-2">
            <Image
              src="/images/slug-icon.png"
              width={40}
              height={40}
              alt="Slug Icon"
            />
            <a href="#" className="text-2xl font-bold text-gray-800">
              UCSC Course Planner
            </a>
          </div>
          {/* Logo and title end */}

          {/* Buttons start */}
          <div className="flex flex-1 justify-end">
            <Button onClick={setShowExportModal} variant="plain">
              Export Planner
            </Button>
            <Button onClick={setShowMajorCompletionModal} variant="plain">
              Major Progress
            </Button>
            {/* <Avatar /> */}
            {status !== "authenticated" ? (
              <Button
                variant="plain"
                onClick={() => {
                  signIn("google");
                }}
              >
                Login with UCSC account
              </Button>
            ) : (
              <Dropdown>
                <MenuButton color="neutral" variant="plain">
                  <UserAvatar name={session.user?.name} />
                </MenuButton>
                <Menu variant="soft">
                  <MenuItem onClick={() => signOut()}>Sign out</MenuItem>
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

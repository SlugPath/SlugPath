import { Button, Dropdown, MenuButton, Menu, MenuItem } from "@mui/joy";
import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
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
    <header className="bg-white fixed top-0 w-full shadow-md z-50">
      <nav className="container mx-auto py-3">
        <div className="flex justify-between items-center">
          <a href="#" className="text-2xl font-bold text-gray-800">
            UCSC Course Planner
          </a>
          <div className="flex space-x-4">
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
        </div>
      </nav>
    </header>
  );
}

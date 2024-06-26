import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";

import { LogoAlt } from "../Logo";
import LoginButton from "../buttons/LoginButton";
import UserAvatarButton from "../buttons/UserAvatarButton";
import { USER_AVATAR_DEFAULT_IMAGE } from "../miscellaneous/UserAvatar";
import MobileMenu from "./MobileMenu";
import PlannerActions from "./PlannerActions";
import ToggleDarkModeButton from "./ToggleDarkModeButton";

export default async function Navbar() {
  const session = await getServerSession(authOptions);
  const isAuthenticated = session && session.user;

  const image =
    isAuthenticated && session.user.image
      ? session.user.image
      : USER_AVATAR_DEFAULT_IMAGE;

  const name = isAuthenticated && session?.user?.name;
  const email = isAuthenticated && session?.user?.email;

  return (
    <header className="bg-primary-500 w-full">
      <nav className="h-14 px-5 flex flex-row items-center">
        <Link href="/" className="pr-2">
          <LogoAlt className="h-10 w-auto" />
        </Link>

        <div className="hidden lg:flex flex-1 justify-end place-items-center">
          <ToggleDarkModeButton />
          <PlannerActions />
          {isAuthenticated ? (
            <UserAvatarButton image={image} />
          ) : (
            <LoginButton />
          )}
        </div>
        <div className="lg:hidden flex flex-1 justify-end place-items-center">
          <ToggleDarkModeButton />
          <MobileMenu image={image} name={name} email={email} />
        </div>
      </nav>
    </header>
  );
}

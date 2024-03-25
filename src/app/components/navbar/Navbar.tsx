import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";

import { LogoAlt } from "../Logo";
import LoginButton from "../buttons/LoginButton";
import UserAvatarButton from "../buttons/UserAvatarButton";
import { USER_AVATAR_DEFAULT_IMAGE } from "../miscellaneous/UserAvatar";
import ToggleDarkModeButton from "./ToggleDarkModeButton";

export default async function Navbar() {
  const session = await getServerSession(authOptions);
  const isAuthenticated = session && session.user;

  const image =
    isAuthenticated && session.user.image
      ? session.user.image
      : USER_AVATAR_DEFAULT_IMAGE;

  return (
    <header className="bg-primary-500 w-full">
      <nav className="h-14 px-5 flex flex-row items-center">
        <Link href="/" className="pr-2">
          <LogoAlt className="h-10 w-auto" />
        </Link>

        <div className="flex flex-1 justify-end place-items-center gap-2">
          <ToggleDarkModeButton />
          {session && session.user ? (
            <UserAvatarButton image={image} />
          ) : (
            <LoginButton />
          )}
        </div>
      </nav>
    </header>
  );
}

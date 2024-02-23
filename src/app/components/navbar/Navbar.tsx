"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

import { LogoAlt } from "../Logo";
import LoginButton from "../buttons/LoginButton";
import ToggleDarkModeButton from "./ToggleDarkModeButton";

export default function Navbar() {
  const { status } = useSession();

  return (
    <header className="bg-primary-500 w-full">
      <nav className={`${status !== "authenticated" ? "py-1.5" : "py-1"} px-5`}>
        <div className="flex flex-row">
          <Link href="/" className="pr-2">
            <LogoAlt className="h-10 w-auto" />
          </Link>

          <div className="flex flex-1 justify-end place-items-center gap-2">
            <ToggleDarkModeButton />
            <LoginButton />
          </div>
        </div>
      </nav>
    </header>
  );
}

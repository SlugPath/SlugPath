import Image from "next/image";
import LoginButton from "./LoginButton";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const { status } = useSession();

  return (
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

          <div className="flex flex-1 justify-end">
            <LoginButton />
          </div>
        </div>
      </nav>
    </header>
  );
}

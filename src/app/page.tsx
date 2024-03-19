import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import SplitScreenContainer from "./components/accountCreation/SplitScreenContainer";

export default async function Page() {
  const session = await getServerSession();
  if (session?.user.id) redirect("/planner");

  return (
    <SplitScreenContainer>
      <div className="flex flex-col items-center justify-center h-full mx-auto w-full max-w-xl lg:w-[36rem]">
        <h2 className="text-3xl font-bold leading-9 tracking-tight text-gray-900 text-center">
          Welcome to SlugPath 🐌🎉
        </h2>
        <p className="text-subtext leading-7 max-w-md text-center mt-2">
          Let us know what you&apos;re studying and we&apos;ll help you pick
          from UCSC recommended templates. Don&apos;t have a plan yet? No
          worries, start with an empty planner.
        </p>
        <Link
          href="/register"
          className="bg-black flex gap-2 px-6 py-3 rounded-full items-center justify-center mt-8"
        >
          <Image
            src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA"
            alt="Sign in"
            className="h-5 w-auto"
          />
          <p className="text-white">Continue with Google</p>
        </Link>
        <div className="h-40" />
      </div>
    </SplitScreenContainer>
  );
}

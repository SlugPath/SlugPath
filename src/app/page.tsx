import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import LoginGoogleButton from "./components/buttons/LoginGoogleButton";
import SplitScreenContainer from "./register/SplitScreenContainer";

export default async function Page() {
  const session = await getServerSession(authOptions);

  // TODO: centralize routing logic (preferably in middleware)
  if (session) {
    if (session.user.isRecordCreated) {
      redirect("/planner");
    }

    redirect("/register");
  }

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
        <LoginGoogleButton />
        <div className="h-40" />
      </div>
    </SplitScreenContainer>
  );
}

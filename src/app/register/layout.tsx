"use client";

import { cn } from "@/lib/utils";
import useAccountCreationStore from "@/store/account-creation";
import { ArrowBack } from "@mui/icons-material";
// import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";

import SplitScreenContainer from "./SplitScreenContainer";

export default function StepByStepLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // const { data: session } = useSession();

  // // TODO: centralize routing logic (preferably in middleware)
  // // NOTE: don't want to redirect to /register if session is undefined (still pending)
  // if (session === null) {
  //   redirect("/");
  // }

  // if (session) {
  //   if (session.user.isRecordCreated) redirect("/planner");
  // }

  // Zustand store
  const { skipSetup, majors } = useAccountCreationStore((state) => ({
    skipSetup: state.skipSetup,
    majors: state.selectedMajors,
  }));

  // Determine the current step based on the pathname; reroute if step not met
  let step = 1;
  const totalSteps = 3;
  let back = undefined;
  if (pathname === "/register/majors") {
    if (skipSetup === undefined) redirect("/register");

    step = 2;
    back = "/register";
  } else if (pathname === "/register/minors") {
    if (skipSetup === undefined) redirect("/register");
    if (majors === undefined) redirect("/register/majors");

    step = 3;
    back = "/register/majors";
  }

  return (
    <SplitScreenContainer>
      <div className="mx-auto w-full max-w-xl lg:w-[36rem]">
        {back ? (
          <Link
            href={back}
            className="h-10 flex items-center w-fit pr-5 text-subtext"
          >
            <ArrowBack sx={{ height: "0.8em", width: "auto" }} />
            <p className="underline">Back</p>
          </Link>
        ) : (
          <div className="h-10" />
        )}
        {children}
      </div>
      <div className="mx-auto w-full max-w-xl lg:w-[36rem] pb-10 sm:pb-0 pt-20">
        <ProgressBar step={step} totalSteps={totalSteps} />
      </div>
    </SplitScreenContainer>
  );
}

function ProgressBar({
  step,
  totalSteps,
}: {
  step: number;
  totalSteps: number;
}) {
  if (step < 1 || step > totalSteps) {
    throw new Error("Invalid step number");
  }

  return (
    <div className="flex w-full gap-10">
      {Array(totalSteps)
        .fill(true)
        .map((_, i) => (
          <div
            key={i}
            className={cn(
              i < step ? "bg-primary-500" : "bg-gray-200",
              "h-2 rounded-full w-full",
            )}
          />
        ))}
    </div>
  );
}

"use client";

import { cn } from "@/lib/utils";
import { ArrowBack } from "@mui/icons-material";
import Link from "next/link";
import { usePathname } from "next/navigation";

import SplitScreenContainer from "../components/accountCreation/SplitScreenContainer";

export default function StepByStepLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Determine the current step based on the pathname
  let step = 1;
  let back = undefined;
  if (pathname === "/register/majors") {
    step = 2;
    back = "/register";
  } else if (pathname === "/register/minors") {
    step = 3;
    back = "/register/majors";
  }
  const totalSteps = 3;

  return (
    <SplitScreenContainer>
      <div className="mx-auto w-full max-w-lg lg:w-[32rem]">
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
      <div className="mx-auto w-full max-w-lg lg:w-[32rem] pb-10 sm:pb-0 pt-20">
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

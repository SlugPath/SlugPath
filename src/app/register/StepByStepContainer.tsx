import { cn } from "@/lib/utils";
import { ArrowBack } from "@mui/icons-material";
import Link from "next/link";

import SplitScreenContainer from "./SplitScreenContainer";

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

interface StepByStepContainerProps {
  step: number;
  totalSteps: number;
  back?: string;
  children: React.ReactNode;
}

export default function StepByStepContainer({
  back,
  step,
  totalSteps,
  children,
}: StepByStepContainerProps) {
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

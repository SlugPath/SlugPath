"use client";

import { cn } from "@/lib/utils";
import useAccountCreationStore from "@/store/account-creation";
import { AutoAwesome, Map } from "@mui/icons-material";
import Link from "next/link";

import SelectBox from "../components/accountCreation/SelectBox";

export default function Register() {
  const { skipSetup, setSkipSetup } = useAccountCreationStore();

  return (
    <>
      <div>
        <h2 className="mt-8 text-3xl font-bold leading-9 tracking-tight text-gray-900">
          Start you&apos;re degree off right
        </h2>
        <div className="h-2" />
        <p className="text-subtext leading-7 max-w-md">
          Let us know what you&apos;re studying and we&apos;ll help you pick
          from UCSC recommended templates. Don&apos;t have a plan yet? No
          worries, start with an empty planner.
        </p>
      </div>

      <div className="h-12" />

      <SelectBox
        selected={skipSetup === false}
        setSelected={() => setSkipSetup(false)}
      >
        <div className="flex gap-3">
          <div className="border-gray-300 border-2 rounded-lg p-2 w-fit h-fit">
            <Map className="h-6 w-auto" sx={{ color: "#000" }} />
          </div>
          <div>
            <p className="font-bold">
              Specify majors and minors{" "}
              <span className="text-subtext">(recommended)</span>
            </p>
            <p className="text-subtext">
              Pick from UCSC&apos;s suggested curriculums
            </p>
          </div>
        </div>
      </SelectBox>

      <div className="h-5" />

      <SelectBox
        selected={skipSetup === true}
        setSelected={() => setSkipSetup(true)}
      >
        <div className="flex gap-3">
          <div className="border-gray-300 border-2 rounded-lg p-2 h-fit w-fit">
            <AutoAwesome className="h-6 w-auto" sx={{ color: "#000" }} />
          </div>
          <div>
            <p className="font-bold">Skip account creation</p>
            <p className="text-subtext">Get started with a blank planner</p>
          </div>
        </div>
      </SelectBox>

      <div className="h-10" />

      <Link
        href="/register/majors"
        className={cn(
          skipSetup === undefined && "cursor-not-allowed opacity-50",
          "bg-primary-500 text-white w-full flex items-center justify-center py-2 rounded-lg transition-opacity",
        )}
        aria-disabled={skipSetup === undefined}
      >
        Continue
      </Link>
    </>
  );
}

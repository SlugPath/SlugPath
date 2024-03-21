"use client";

import { createUser } from "@/app/actions/user";
import { cn } from "@/lib/utils";
import useAccountCreationStore from "@/store/account-creation";
import { AutoAwesome, Map } from "@mui/icons-material";
import { CircularProgress } from "@mui/joy";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";

import SelectBox from "../../components/accountCreation/SelectBox";

export default function Register() {
  const { data: session, update: updateSession } = useSession();
  const user = session?.user;

  const router = useRouter();

  const [isCreatingUser, setIsCreatingUser] = useState(false);

  const skipSetup = useAccountCreationStore((state) => state.skipSetup);
  const setSkipSetup = useAccountCreationStore((state) => state.setSkipSetup);

  const handleContinue = async () => {
    if (skipSetup) {
      if (!user) {
        console.error("User not found");
        return;
      }
      setIsCreatingUser(true);

      await createUser(
        {
          userId: user.id,
          email: user.email!,
          name: user.name!,
        },
        [],
      );

      updateSession({ ...session, user: { ...user, isRecordCreated: true } });
      // TODO: centralize routing logic (preferably in middleware)
      redirect("/planner");
    }

    router.push("/register/majors");
  };

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

      <button
        className={cn(
          false && "cursor-not-allowed opacity-50",
          "bg-primary-500 text-white w-full flex items-center justify-center py-3 rounded-lg transition-opacity font-bold",
        )}
        aria-disabled={false}
        onClick={handleContinue}
      >
        {isCreatingUser ? <CircularProgress size="sm" /> : "Continue"}
      </button>
    </>
  );
}

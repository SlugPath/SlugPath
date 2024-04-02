"use client";

import { getPrograms } from "@/app/actions/program";
import { createUser } from "@/app/actions/user";
import useAccountCreationStore from "@/store/account-creation";
import { AutoAwesome, Map } from "@mui/icons-material";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import ContinueButton from "../../components/buttons/ContinueButton";
import SelectBox from "./SelectBox";

export default function Register() {
  const { data: session, update: updateSession } = useSession();
  const user = session?.user;

  const queryClient = useQueryClient();
  const router = useRouter();

  const [isCreatingUser, setIsCreatingUser] = useState(false);

  // Zustand store
  const skipSetup = useAccountCreationStore((state) => state.skipSetup);
  const setSkipSetup = useAccountCreationStore((state) => state.setSkipSetup);

  const isContinueDisabled = skipSetup === undefined;

  // Create user or not based on skipSetup, then redirect
  const handleContinue = async () => {
    if (isContinueDisabled) return;

    if (!skipSetup) {
      router.push("/register/majors");
      return;
    }

    // Skip account creation
    setIsCreatingUser(true);

    await createUser(
      {
        userId: user!.id,
        email: user!.email!,
        name: user!.name!,
      },
      [],
    );

    // NOTE: Session update forces redirect in layout
    await updateSession({
      ...session,
      user: { ...user, isRecordCreated: true },
    });
  };

  // On queryClient mount, prefetch programs for future program selectors
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["programs"],
      queryFn: () => getPrograms(),
    });
  }, [queryClient]);

  return (
    <>
      <div className="space-y-2">
        <h2 className="mt-8 text-3xl font-bold leading-9 tracking-tight text-gray-900">
          Start your degree off right
        </h2>
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

      <ContinueButton
        disabled={isContinueDisabled}
        loading={isCreatingUser}
        onClick={handleContinue}
      >
        Continue
      </ContinueButton>
    </>
  );
}

"use client";

import { createUser } from "@/app/actions/user";
import useAccountCreationStore from "@/store/account-creation";
import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
import { useState } from "react";

import ContinueButton from "../ContinueButton";
import ProgramSelector from "../ProgramSelector";

export default function Minors() {
  const { data: session } = useSession();
  // const router = useRouter();

  const [isCreatingUser, setIsCreatingUser] = useState(false);

  // Zustand store
  const selectedMajors = useAccountCreationStore(
    (state) => state.selectedMajors,
  );
  const selectedMinors = useAccountCreationStore(
    (state) => state.selectedMinors,
  );
  const addMinor = useAccountCreationStore((state) => state.addMinor);
  const deleteMinor = useAccountCreationStore((state) => state.deleteMinor);

  // Create user and route to planner page
  const handleStartPlanning = async () => {
    setIsCreatingUser(true);

    const majorIds = selectedMajors
      ? selectedMajors.map((major) => major.id)
      : [];
    const minorIds = selectedMinors
      ? selectedMinors.map((minor) => minor.id)
      : [];
    const programIds = [...majorIds, ...minorIds];

    await createUser(
      {
        userId: session!.user!.id!,
        email: session!.user!.email!,
        name: session?.user.name ?? "",
      },
      programIds,
    );

    // TODO: Update JWT with user record creation status w/o refreshing
    location.reload();
  };

  return (
    <>
      <div>
        <h2 className="mt-8 text-3xl font-bold leading-9 tracking-tight text-gray-900">
          Add any minors
        </h2>
        <div className="h-2" />
        <p className="text-subtext leading-7 max-w-md">
          Almost done! Add any minors you&apos;re considering pursuing. You can
          also skip and add these later if you would like.
        </p>
      </div>

      <div className="h-12" />

      <ProgramSelector
        programType="Minor"
        selectedPrograms={selectedMinors}
        addProgram={addMinor}
        deleteProgram={deleteMinor}
      />

      <div className="h-10" />

      <ContinueButton loading={isCreatingUser} onClick={handleStartPlanning}>
        Start Planning
      </ContinueButton>
    </>
  );
}

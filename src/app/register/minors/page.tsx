"use client";

import { createUser } from "@/app/actions/user";
import { cn } from "@/lib/utils";
import useAccountCreationStore from "@/store/account-creation";
import { CircularProgress } from "@mui/joy";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState } from "react";

import ProgramSelector from "../ProgramSelector";

export default function Minors() {
  const { data: session, update: updateSession } = useSession();

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

    // NOTE: Session update forces redirect in layout
    await updateSession({
      ...session,
      user: { ...session!.user, isRecordCreated: true },
    });

    // TODO: Centralize routing logic (pregerably in middleware)
    // NOTE: Session update forced redirect (`updateSession`) causes hot reload
    // error with client side routing, redirect call needed to avoid this
    redirect("/planner");
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

      <button
        className={cn(
          false && "cursor-not-allowed opacity-50",
          "bg-primary-500 text-white w-full flex items-center justify-center py-3 rounded-lg transition-opacity font-bold",
        )}
        aria-disabled={false}
        onClick={handleStartPlanning}
      >
        {isCreatingUser ? <CircularProgress size="sm" /> : "Start Planning"}
      </button>
    </>
  );
}

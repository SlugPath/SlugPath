"use client";

import { cn } from "@/lib/utils";
import useAccountCreationStore from "@/store/account-creation";
import { useRouter } from "next/navigation";

import ProgramSelector from "../ProgramSelector";

export default function Majors() {
  const router = useRouter();

  // Zustand store
  const selectedMajors = useAccountCreationStore(
    (state) => state.selectedMajors,
  );
  const setMajor = useAccountCreationStore((state) => state.setMajor);
  const addMajor = useAccountCreationStore((state) => state.addMajor);
  const deleteMajor = useAccountCreationStore((state) => state.deleteMajor);

  const handleContinue = () => {
    // NOTE: Routing restricted if selectedMajors is undefined
    if (!selectedMajors) {
      setMajor([]);
    }
    router.push("/register/minors");
  };

  return (
    <>
      <div>
        <h2 className="mt-8 text-3xl font-bold leading-9 tracking-tight text-gray-900">
          Pick your major
        </h2>
        <div className="h-2" />
        <p className="text-subtext leading-7 max-w-md">
          Start by adding your major (or majors). You can always change these
          later.
        </p>
      </div>

      <div className="h-12" />

      <ProgramSelector
        programType="Major"
        selectedPrograms={selectedMajors}
        addProgram={addMajor}
        deleteProgram={deleteMajor}
      />

      <div className="h-10" />

      <button
        className={cn(
          false && "cursor-not-allowed opacity-50",
          "bg-primary-500 text-white w-full flex items-center justify-center py-3 rounded-lg transition-opacity font-bold",
        )}
        aria-disabled={false}
        onClick={handleContinue}
      >
        Continue
      </button>
    </>
  );
}

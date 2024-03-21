"use client";

import { createUser } from "@/app/actions/user";
import ProgramChip from "@/app/components/ProgramChip";
import { usePrograms } from "@/app/hooks/reactQuery";
import { Program } from "@/app/types/Program";
import { cn, filterRedundantPrograms, isContainingName } from "@/lib/utils";
import useAccountCreationStore from "@/store/account-creation";
import { Add, Error, Warning } from "@mui/icons-material";
import { Autocomplete, CircularProgress, Option, Select } from "@mui/joy";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const MAX_MINOR_SELECTIONS = 2;

export default function Minors() {
  const { data: session, update: updateSession } = useSession();

  const [minorInput, setMinorInput] = useState("");
  const [minorValue, setMinorValue] = useState<Program | null>(null); // undefined MUI components are uncontrolled
  const [catalogYearInput, setCatalogYearInput] = useState("");

  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [error, setError] = useState("");

  // Zustand store
  const selectedMajors = useAccountCreationStore(
    (state) => state.selectedMajors,
  );
  const selectedMinors = useAccountCreationStore(
    (state) => state.selectedMinors,
  );
  const addMinorInfo = useAccountCreationStore((state) => state.addMinor);
  const deleteMinorInfo = useAccountCreationStore((state) => state.deleteMinor);

  const isMaxMajorsSelected = !!(
    selectedMinors && selectedMinors.length >= MAX_MINOR_SELECTIONS
  );

  // NOTE: Instead of fetching minors and years separately, fetch all programs
  // and filter to reduce db calls
  const { data: programs, isPending, isFetching, isError } = usePrograms();
  const minors = useMemo(() => {
    const uniquePrograms = filterRedundantPrograms(programs ?? []);
    return uniquePrograms?.filter((program) => program.programType === "Minor");
  }, [programs]);

  const catalogYears = programs?.filter(
    (program) => program.name === (minorValue ? minorValue.name : ""),
  );

  // Add a program to the list of selected programs
  const handleAddProgram = () => {
    setError("");

    const programId = catalogYears!.find(
      (program) => program.catalogYear === catalogYearInput,
    )!.id;

    if (selectedMinors && isContainingName(minorValue!.name, selectedMinors)) {
      setError("You have already added this major");
      return;
    }

    if (isMaxMajorsSelected) return;

    addMinorInfo({
      id: programId,
      name: minorValue!.name,
      catalogYear: catalogYearInput,
    });
  };

  // Delete a program from the list of selected programs
  const handleDeleteProgram = (programId: number) => {
    setError("");
    deleteMinorInfo(programId);
  };

  // TODO: Store selected majors and minors in the database, and navigate to the
  // next page
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

    updateSession({
      ...session,
      user: { ...session!.user, isRecordCreated: true },
    });
    // TODO: centralize routing logic (preferably in middleware)
    redirect("/planner");
  };

  // NOTE: User thrown errors (more than one of same major) exist in addition to
  // fetching errors; requires independent error state
  useEffect(() => {
    setError(
      isError
        ? "There was an error loading the programs. Please try again later"
        : "",
    );
  }, [isError]);

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

      <div className="flex flex-col md:flex-row gap-4">
        <Autocomplete
          value={minorValue}
          options={minors}
          getOptionLabel={(option) => option.name}
          placeholder="Minor"
          variant="plain"
          onChange={(_, newValue) => {
            setMinorValue(newValue ?? null);
            setError("");
          }}
          inputValue={minorInput}
          onInputChange={(_, newInputValue) => {
            setMinorInput(newInputValue);
            setError("");
          }}
          sx={{ flex: "1 1 0%" }}
          disabled={isError}
          loading={isPending || isFetching}
          endDecorator={
            isPending || isFetching ? (
              <CircularProgress
                size="sm"
                sx={{ bgcolor: "background.surface" }}
              />
            ) : null
          }
        />

        <Select
          value={catalogYearInput}
          placeholder="Catalog Year"
          variant="plain"
          onChange={(_, newValue) => {
            setCatalogYearInput(newValue ?? "");
            setError("");
          }}
          sx={{ minWidth: "9.1rem" }}
          disabled={!minorValue}
        >
          {catalogYears?.map((year) => (
            <Option key={year.catalogYear} value={year.catalogYear}>
              {year.catalogYear}
            </Option>
          ))}
        </Select>

        <button
          type="button"
          className={cn(
            (!minorValue || !catalogYearInput || isMaxMajorsSelected) &&
              "cursor-not-allowed opacity-50",
            "bg-primary-500 text-white px-3 py-1 rounded-lg flex items-center justify-center gap-1 font-bold",
          )}
          onClick={handleAddProgram}
          disabled={!minorValue || !catalogYearInput || isMaxMajorsSelected}
        >
          <Add sx={{ color: "#fff" }} />
          Add
        </button>
      </div>

      {/* Warn / error */}
      <div className="h-10 flex items-center">
        {!isMaxMajorsSelected && error.length > 0 && (
          <p className="text-red-500 text-sm mt-2 flex items-center">
            <Error
              sx={{
                color: "rgb(239 68 68 / 1)",
                marginRight: "0.2rem",
                height: "1rem",
              }}
            />
            {error}
          </p>
        )}
        {isMaxMajorsSelected && (
          <p className="text-yellow-500 text-sm mt-2 flex items-center">
            <Warning
              sx={{
                color: "rgb(234 179 8 / 1)",
                marginRight: "0.2rem",
                height: "1rem",
              }}
            />
            You can&apos;t add more than 2 minors
          </p>
        )}
      </div>

      <div className="h-4" />

      {/* Selected Programs */}
      <div className="bg-gray-50 rounded-lg min-h-48 flex items-center justify-start flex-col p-5 gap-5">
        {(!selectedMinors || selectedMinors.length == 0) && (
          <p className="text-subtext w-full text-center flex-1 flex items-center justify-center">
            No minor selected
          </p>
        )}
        {selectedMinors &&
          selectedMinors.map((program) => (
            <ProgramChip
              key={program.name + program.catalogYear}
              programName={program.name}
              catalogYear={program.catalogYear}
              deleteProgram={() => handleDeleteProgram(program.id)}
            />
          ))}
      </div>

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

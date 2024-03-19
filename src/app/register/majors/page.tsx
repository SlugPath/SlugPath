"use client";

import ProgramChip from "@/app/components/ProgramChip";
import { usePrograms } from "@/app/hooks/reactQuery";
import { Program } from "@/app/types/Program";
import { cn, filterRedundantPrograms, isContainingName } from "@/lib/utils";
import useAccountCreationStore from "@/store/account-creation";
import { Add, Error, Warning } from "@mui/icons-material";
import { Autocomplete, CircularProgress, Option, Select } from "@mui/joy";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const MAX_MAJOR_SELECTIONS = 2;

export default function Majors() {
  const router = useRouter();
  const [majorInput, setMajorInput] = useState("");
  const [majorValue, setMajorValue] = useState<Program | null>(null); // undefined MUI components are uncontrolled
  const [catalogYearValue, setCatalogYearValue] = useState("");

  const [error, setError] = useState("");

  // Zustand store
  const selectedMajors = useAccountCreationStore(
    (state) => state.selectedMajors,
  );
  const setMajor = useAccountCreationStore((state) => state.setMajor);
  const addMajor = useAccountCreationStore((state) => state.addMajor);
  const deleteMajor = useAccountCreationStore((state) => state.deleteMajor);

  const isMaxMajorsSelected = !!(
    selectedMajors && selectedMajors.length >= MAX_MAJOR_SELECTIONS
  );

  // Instead of fetching majors and years separately, fetch all programs and
  // filter to reduce db calls
  const { data: programs, isPending, isFetching, isError } = usePrograms();
  const majors = useMemo(() => {
    const uniquePrograms = filterRedundantPrograms(programs ?? []);
    return uniquePrograms?.filter((program) => program.programType === "Major");
  }, [programs]);

  const catalogYears = programs?.filter(
    (program) => program.name === (majorValue ? majorValue.name : ""),
  );

  // Add a program to the list of selected programs
  const handleAddProgram = () => {
    setError("");

    const programId = catalogYears!.find(
      (program) => program.catalogYear === catalogYearValue,
    )!.id;

    if (selectedMajors && isContainingName(majorValue!.name, selectedMajors)) {
      setError("You have already added this major");
      return;
    }

    if (isMaxMajorsSelected) return;

    addMajor({
      id: programId,
      name: majorValue!.name,
      catalogYear: catalogYearValue,
    });
  };

  // Delete a program from the list of selected programs
  const handleDeleteProgram = (programId: number) => {
    setError("");
    deleteMajor(programId);
  };

  const handleContinue = () => {
    if (!selectedMajors) {
      setMajor([]);
    }
    router.push("/register/minors");
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
          Pick your major
        </h2>
        <div className="h-2" />
        <p className="text-subtext leading-7 max-w-md">
          Start by adding your major (or majors). You can always change these
          later.
        </p>
      </div>

      <div className="h-12" />

      <div className="flex flex-col md:flex-row gap-4">
        <Autocomplete
          value={majorValue}
          options={majors}
          getOptionLabel={(option) => option.name}
          placeholder="Major"
          variant="plain"
          onChange={(_, newValue) => {
            setMajorValue(newValue ?? null);
            setError("");
          }}
          inputValue={majorInput}
          onInputChange={(_, newInputValue) => {
            setMajorInput(newInputValue);
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
          value={catalogYearValue}
          placeholder="Catalog Year"
          variant="plain"
          onChange={(_, newValue) => {
            setCatalogYearValue(newValue ?? "");
            setError("");
          }}
          sx={{ minWidth: "9.1rem" }}
          disabled={!majorValue}
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
            (!majorValue || !catalogYearValue || isMaxMajorsSelected) &&
              "cursor-not-allowed opacity-50",
            "bg-primary-500 text-white px-3 py-1 rounded-lg flex items-center justify-center gap-1 font-bold",
          )}
          onClick={handleAddProgram}
          disabled={!majorValue || !catalogYearValue || isMaxMajorsSelected}
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
            You can&apos;t add more than 2 majors
          </p>
        )}
      </div>

      <div className="h-4" />

      {/* Selected Programs */}
      <div className="bg-gray-50 rounded-lg min-h-48 flex items-center justify-start flex-col p-5 gap-5">
        {(selectedMajors === undefined || selectedMajors.length == 0) && (
          <p className="text-subtext w-full text-center flex-1 flex items-center justify-center">
            No major selected
          </p>
        )}
        {selectedMajors &&
          selectedMajors.map((program) => (
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
        onClick={handleContinue}
      >
        Continue
      </button>
    </>
  );
}

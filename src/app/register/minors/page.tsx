"use client";

import ProgramChip from "@/app/components/ProgramChip";
import { usePrograms } from "@/app/hooks/reactQuery";
import {
  cn,
  filterRedundantPrograms,
  isProgramNameInProgramInfos,
} from "@/lib/utils";
import useAccountCreationStore from "@/store/account-creation";
import { Add, Error, Warning } from "@mui/icons-material";
import { LinearProgress, Option, Select } from "@mui/joy";
import { useEffect, useMemo, useState } from "react";

const MAX_MINOR_SELECTIONS = 2;

export default function Minors() {
  const [minorInput, setMinorInput] = useState("");
  const [catalogYearInput, setCatalogYearInput] = useState("");

  // Zustand store
  const selectedMajors = useAccountCreationStore(
    (state) => state.selectedMajors,
  );
  const selectedMinors = useAccountCreationStore(
    (state) => state.selectedMinors,
  );
  const addMinorInfo = useAccountCreationStore((state) => state.addMinorInfo);
  const deleteMinorInfo = useAccountCreationStore(
    (state) => state.deleteMinorInfo,
  );

  const isMaxMajorsSelected = !!(
    selectedMinors && selectedMinors.length >= MAX_MINOR_SELECTIONS
  );

  const [error, setError] = useState("");

  // NOTE: Instead of fetching minors and years separately, fetch all programs
  // and filter to reduce db calls
  const { data: programs, isPending, isFetching, isError } = usePrograms();
  const minors = useMemo(() => {
    const uniquePrograms = filterRedundantPrograms(programs ?? []);
    return uniquePrograms?.filter((program) => program.programType === "Minor");
  }, [programs]);

  const catalogYears = programs?.filter(
    (program) => program.name === minorInput,
  );

  // Add a program to the list of selected programs
  const handleAddProgram = () => {
    setError("");

    if (
      selectedMinors &&
      isProgramNameInProgramInfos(minorInput, selectedMinors)
    ) {
      setError("You have already added this major");
      return;
    }

    if (isMaxMajorsSelected) return;

    addMinorInfo({ programName: minorInput, catalogYear: catalogYearInput });
  };

  // Delete a program from the list of selected programs
  const handleDeleteProgram = (programName: string, catalogYear: string) => {
    setError("");
    deleteMinorInfo({ programName, catalogYear });
  };

  // TODO: Store selected majors and minors in the database, and navigate to the
  // next page
  const handleStartPlanning = () => {
    alert(
      JSON.stringify(
        {
          selectedMajors,
          selectedMinors,
        },
        null,
        2,
      ),
    );
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
          Add any minors you are thinking of pursuing (don&apos;t worry, you can
          always change these later).
        </p>
      </div>

      <div className="h-12" />

      <div className="flex flex-col md:flex-row gap-4">
        <Select
          value={minorInput}
          placeholder="Minor"
          variant="plain"
          onChange={(_, newValue) => {
            setMinorInput(newValue ?? "");
            setError("");
          }}
          className="flex-1 border-gray-500"
          disabled={isError || isPending || isFetching}
        >
          {minors &&
            minors.map((major) => (
              <Option key={major.name} value={major.name}>
                {major.name}
              </Option>
            ))}
        </Select>

        <Select
          value={catalogYearInput}
          placeholder="Catalog Year"
          variant="plain"
          onChange={(_, newValue) => {
            setCatalogYearInput(newValue ?? "");
            setError("");
          }}
          disabled={!minorInput}
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
            (!minorInput || !catalogYearInput || isMaxMajorsSelected) &&
              "cursor-not-allowed opacity-50",
            "bg-primary-500 text-white px-3 py-1 rounded-lg flex items-center justify-center gap-1 font-bold",
          )}
          onClick={handleAddProgram}
          disabled={!minorInput || !catalogYearInput || isMaxMajorsSelected}
        >
          <Add sx={{ color: "#fff" }} />
          Add
        </button>
      </div>

      <div className="h-10 flex items-center">
        {(isPending || isFetching) && <LinearProgress />}
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

      <div className="bg-gray-50 rounded-lg min-h-48 flex items-center justify-start flex-col p-5 gap-5">
        {(!selectedMinors || selectedMinors.length == 0) && (
          <p className="text-subtext w-full text-center flex-1 flex items-center justify-center">
            No minor selected
          </p>
        )}
        {selectedMinors &&
          selectedMinors.map((program) => (
            <ProgramChip
              key={program.programName + program.catalogYear}
              programName={program.programName}
              catalogYear={program.catalogYear}
              deleteProgram={() =>
                handleDeleteProgram(program.programName, program.catalogYear)
              }
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
        Start Planning
      </button>
    </>
  );
}

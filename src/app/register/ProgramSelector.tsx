import { cn, filterRedundantPrograms, isContainingName } from "@/lib/utils";
import { Add, Close, Error, School, Warning } from "@mui/icons-material";
import {
  Autocomplete,
  CircularProgress,
  Option,
  Select,
  Tooltip,
} from "@mui/joy";
import { ProgramType } from "@prisma/client";
import { useEffect, useMemo, useState } from "react";

import { usePrograms } from "../hooks/reactQuery";
import { Program } from "../types/Program";

const MAX_PROGRAM_SELECTIONS = 2;

interface ProgramSelectorProps {
  programType: ProgramType;
  selectedPrograms: Program[] | undefined;
  addProgram: (program: Program) => void;
  deleteProgram: (programId: number) => void;
}

export default function ProgramSelector({
  programType,
  selectedPrograms,
  addProgram,
  deleteProgram,
}: ProgramSelectorProps) {
  const [minorInput, setMinorInput] = useState("");
  const [minorValue, setMinorValue] = useState<Program | null>(null); // undefined MUI components are uncontrolled
  const [catalogYearInput, setCatalogYearInput] = useState("");

  const [error, setError] = useState("");

  // NOTE: Instead of fetching minors and years separately, fetch all programs
  // and filter to reduce db calls
  const { data: allPrograms, isPending, isFetching, isError } = usePrograms();
  const programs = useMemo(() => {
    const uniquePrograms = filterRedundantPrograms(allPrograms ?? []);
    return uniquePrograms?.filter(
      (program) => program.programType === programType,
    );
  }, [allPrograms, programType]);

  const catalogYears = allPrograms?.filter(
    (program) => program.name === (minorValue ? minorValue.name : ""),
  );

  const isMaxMajorsSelected = !!(
    selectedPrograms && selectedPrograms.length >= MAX_PROGRAM_SELECTIONS
  );

  // Add a program to the list of selected programs
  const handleAddProgram = () => {
    setError("");

    const programId = catalogYears!.find(
      (program) => program.catalogYear === catalogYearInput,
    )!.id;

    if (
      selectedPrograms &&
      isContainingName(minorValue!.name, selectedPrograms)
    ) {
      setError("You have already added this major");
      return;
    }

    if (isMaxMajorsSelected) return;

    addProgram({
      id: programId,
      name: minorValue!.name,
      catalogYear: catalogYearInput,
      programType: programType,
    });
  };

  // Delete a program from the list of selected programs
  const handleDeleteProgram = (programId: number) => {
    setError("");
    deleteProgram(programId);
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
      {/* Program, catalogYear, add button */}
      <div className="flex flex-col md:flex-row gap-4">
        <Autocomplete
          value={minorValue}
          options={programs}
          getOptionLabel={(option) => option.name}
          placeholder={programType === ProgramType.Major ? "Major" : "Minor"}
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
        {(!selectedPrograms || selectedPrograms.length == 0) && (
          <p className="text-subtext w-full text-center flex-1 flex items-center justify-center">
            No minor selected
          </p>
        )}
        {selectedPrograms &&
          selectedPrograms.map((program) => (
            <ProgramChip
              key={program.name + program.catalogYear}
              programName={program.name}
              catalogYear={program.catalogYear}
              deleteProgram={() => handleDeleteProgram(program.id)}
            />
          ))}
      </div>
    </>
  );
}

function ProgramChip({
  programName,
  catalogYear,
  deleteProgram,
}: {
  programName: string;
  catalogYear: string;
  deleteProgram: () => void;
}) {
  return (
    <div className="flex gap-2 items-center bg-white shadow-md w-full px-5 py-4 rounded-lg justify-between">
      <div className="flex flex-row gap-2 items-center min-w-0">
        <School sx={{ color: "#000", height: "2rem", marginRight: "0.5rem" }} />
        <Tooltip title={programName} placement="top">
          <p className="truncate">{programName}</p>
        </Tooltip>
        <p className="text-subtext min-w-fit">({catalogYear})</p>
      </div>
      <button className="ml-5" onClick={deleteProgram}>
        <Close sx={{ color: "#000", height: "2rem" }} />
      </button>
    </div>
  );
}

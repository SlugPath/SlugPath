"use client";

import { usePrograms } from "@/app/hooks/reactQuery";
import {
  cn,
  filterRedundantPrograms,
  isProgramInfoInProgramInfos,
} from "@/lib/utils";
import useAccountCreationStore from "@/store/account-creation";
import { Add, Close, Error, School, Warning } from "@mui/icons-material";
import { LinearProgress, Option, Select, Tooltip } from "@mui/joy";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const MAX_MAJOR_SELECTIONS = 2;

export default function Majors() {
  const [majorInput, setMajorInput] = useState("");
  const [catalogYearInput, setCatalogYearInput] = useState("");

  // Zustand store
  const selectedMajors = useAccountCreationStore(
    (state) => state.selectedMajors,
  );
  const addMajorInfo = useAccountCreationStore((state) => state.addMajorInfo);
  const deleteMajor = useAccountCreationStore((state) => state.deleteMajor);

  console.log(selectedMajors);

  //TODO: Test when catalogYears is defined, but select a major with no program
  //for that catalog year

  const [error, setError] = useState("");

  // Instead of fetching majors and years separately, fetch all programs and
  // filter to reduce db calls
  const { data: programs, isPending, isFetching, isError } = usePrograms();
  const majors = useMemo(() => {
    const uniquePrograms = filterRedundantPrograms(programs ?? []);
    return uniquePrograms?.filter((program) => program.programType === "Major");
  }, [programs]);

  const catalogYears = programs?.filter(
    (program) => program.name === majorInput,
  );

  // Add a program to the list of selected programs
  const handleAddProgram = () => {
    setError("");
    const programInfo = {
      programName: majorInput,
      catalogYear: catalogYearInput,
    };

    if (
      selectedMajors &&
      isProgramInfoInProgramInfos(programInfo, selectedMajors)
    ) {
      setError("You have already added this major");
      return;
    }

    if (selectedMajors && selectedMajors.length >= MAX_MAJOR_SELECTIONS) return;

    addMajorInfo(programInfo);
  };

  // Delete a program from the list of selected programs
  const handleDeleteProgram = (programName: string, catalogYear: string) => {
    setError("");
    deleteMajor({ programName, catalogYear });
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

      <div className="flex gap-4">
        <Select
          value={majorInput}
          placeholder="Major"
          variant="plain"
          onChange={(_, newValue) => {
            setMajorInput(newValue ?? "");
            setError("");
          }}
          className="flex-1 border-gray-500"
          disabled={isError || isPending || isFetching}
        >
          {majors &&
            majors.map((major) => (
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
          disabled={!majorInput}
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
            (!majorInput || !catalogYearInput) &&
              "cursor-not-allowed opacity-50",
            "bg-primary-500 text-white px-3 py-1 rounded-lg flex items-center justify-center gap-1 font-bold",
          )}
          onClick={handleAddProgram}
          disabled={!majorInput || !catalogYearInput}
        >
          <Add sx={{ color: "#fff" }} />
          Add
        </button>
      </div>

      <div className="h-10 flex items-center">
        {(isPending || isFetching) && <LinearProgress />}
        {selectedMajors &&
          selectedMajors.length < MAX_MAJOR_SELECTIONS &&
          error.length > 0 && (
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
        {selectedMajors && selectedMajors.length >= MAX_MAJOR_SELECTIONS && (
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

      <div className="bg-gray-50 rounded-lg min-h-48 flex items-center justify-start flex-col p-5 gap-5">
        {(selectedMajors === undefined || selectedMajors.length == 0) && (
          <p className="text-subtext w-full text-center flex-1 flex items-center justify-center">
            No major selected
          </p>
        )}
        {selectedMajors &&
          selectedMajors.map((program) => (
            <ProgramTag
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

      <Link
        href="/register/minors"
        className={cn(
          false && "cursor-not-allowed opacity-50",
          "bg-primary-500 text-white w-full flex items-center justify-center py-3 rounded-lg transition-opacity font-bold",
        )}
        aria-disabled={false}
      >
        Continue
      </Link>
    </>
  );
}

function ProgramTag({
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

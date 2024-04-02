"use client";

import ContinueButton from "@/app/components/buttons/ContinueButton";
import { useUserPrograms } from "@/app/hooks/reactQuery";
import { Program } from "@/app/types/Program";
import { CircularProgress, Option, Select } from "@mui/joy";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function CurriculumSelect() {
  const { data: session } = useSession();
  const userId = session?.user.id;

  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  // Fetch user programs
  const {
    data: userPrograms,
    isPending: userProgramsIsPending,
    isFetching: userProgramsIsFetching,
  } = useUserPrograms(userId);

  const isUserProgramsLoading = userProgramsIsPending || userProgramsIsFetching;
  const isUserProgramsEmpty = !(userPrograms && userPrograms.length > 0);

  // Set the first program as the selected program
  useEffect(() => {
    if (!selectedProgram && userPrograms && userPrograms.length > 0) {
      setSelectedProgram(userPrograms![0]);
    }
  }, [userPrograms, selectedProgram]);

  return (
    <div className="flex-1 h-full w-full flex flex-col items-center justify-center p-5">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold leading-9 tracking-tight text-gray-900 text-center">
          Select a starting curriculum
        </h1>
        <p className="text-subtext leading-7 max-w-md text-center">
          Build your schedule based on your primary program. Pick from UCSC
          recommended plans.
        </p>
      </div>

      <Select
        placeholder="Choose one…"
        variant="plain"
        value={selectedProgram}
        onChange={(_, newValue) =>
          newValue != null && setSelectedProgram(newValue)
        }
        disabled={isUserProgramsLoading || isUserProgramsEmpty}
        sx={{ width: "100%", maxWidth: "32rem" }}
        endDecorator={
          isUserProgramsLoading ? (
            <CircularProgress
              size="sm"
              sx={{ bgcolor: "background.surface" }}
            />
          ) : null
        }
      >
        {userPrograms &&
          userPrograms.map((major, index) => (
            <Option key={index} value={major}>
              {major.name} {major.catalogYear}
            </Option>
          ))}
      </Select>

      {/* {!isUserProgramsEmpty && selectedProgram && (
      )} */}

      <div className="max-w-lg w-full">
        <ContinueButton onClick={() => {}}>Use this template</ContinueButton>
      </div>
    </div>
  );
}

// function CurriculumSelectCarosel() {
//   return (

//   )
// }

"use client";

import ContinueButton from "@/app/components/buttons/ContinueButton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/app/components/miscellaneous/Carousel";
import {
  useProgramDefaultPlanners,
  useUserPrograms,
} from "@/app/hooks/reactQuery";
import { PlannerTitle } from "@/app/types/Planner";
import { Program } from "@/app/types/Program";
import { CircularProgress, Option, Select } from "@mui/joy";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import MiniPlanner from "./MiniPlanner";

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

  console.log(userPrograms);

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

      {/* Program Select */}
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

      {/* Curriculum Select */}
      {!isUserProgramsEmpty && selectedProgram && (
        <CurriculumSelectCarousel
          key={selectedProgram.id}
          program={selectedProgram}
        />
      )}

      <div className="max-w-lg w-full">
        <ContinueButton onClick={() => {}}>Use this template</ContinueButton>
      </div>
    </div>
  );
}

function CurriculumSelectCarousel({ program }: { program: Program }) {
  // const { data: session } = useSession();
  // const userId = session?.user.id;

  const [selectedPlannerTitle, setSelectedPlannerTitle] =
    useState<PlannerTitle>();

  // Fetch default planners for the program
  const {
    data: _defaultPlanners,
    isPending: defaultPlannersIsPending,
    isFetching: defaultPlannersIsFetching,
  } = useProgramDefaultPlanners(program.name);

  const isDefaultPlannersLoading =
    defaultPlannersIsPending || defaultPlannersIsFetching;

  // Replace course ids with course objects
  const defaultPlanners = _defaultPlanners?.map((planner) => ({
    ...planner,
    quarters: planner.quarters.map((quarter) => ({
      ...quarter,
      courses: quarter.courses.map((courseId) =>
        planner.courses.find((c) => c.id === courseId),
      ),
    })),
  }));

  // Set the default planner to the first planner in the list
  useEffect(() => {
    if (
      defaultPlanners &&
      defaultPlanners.length > 0 &&
      !selectedPlannerTitle
    ) {
      setSelectedPlannerTitle(defaultPlanners[0]);
    }
  }, [defaultPlanners, selectedPlannerTitle]);

  if (isDefaultPlannersLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <CircularProgress size="lg" />
      </div>
    );
  }

  return (
    <Carousel className="flex w-1/2">
      <CarouselContent>
        {defaultPlanners!.map((planner, index) => (
          <CarouselItem
            key={index}
            className="flex items-center justify-center"
          >
            <MiniPlanner plannerState={planner} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

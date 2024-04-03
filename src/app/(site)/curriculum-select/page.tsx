"use client";

import ContinueButton from "@/app/components/buttons/ContinueButton";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/app/components/miscellaneous/Carousel";
import {
  useProgramDefaultPlanners,
  useUpdatePlannersMutation,
  useUserPrograms,
} from "@/app/hooks/reactQuery";
import { PlannerTitle } from "@/app/types/Planner";
import { Program } from "@/app/types/Program";
import { clonePlanner } from "@/lib/plannerUtils";
import { CircularProgress, Option, Select } from "@mui/joy";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { v4 as uuid4 } from "uuid";

import MiniPlanner from "./MiniPlanner";

export default function CurriculumSelect() {
  const { data: session } = useSession();
  const userId = session?.user.id;
  const router = useRouter();

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  // Fetch user programs
  const {
    data: userPrograms,
    isPending: userProgramsIsPending,
    isFetching: userProgramsIsFetching,
  } = useUserPrograms(userId);

  const { mutate: saveAll } = useUpdatePlannersMutation(
    handleUpdatePlannersSuccess,
  );

  const { data: _defaultPlanners } = useProgramDefaultPlanners(
    selectedProgram ? selectedProgram.name : "",
    selectedProgram ? selectedProgram.catalogYear : "",
  );

  const isUserProgramsLoading = userProgramsIsPending || userProgramsIsFetching;
  const isUserProgramsEmpty = !(userPrograms && userPrograms.length > 0);

  // Set the first program as the selected program
  useEffect(() => {
    if (!selectedProgram && userPrograms && userPrograms.length > 0) {
      setSelectedProgram(userPrograms![0]);
    }
  }, [userPrograms, selectedProgram]);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  function handleUpdatePlannersSuccess() {
    router.push("/planner");
  }

  function handleClickUseTemplate() {
    if (!_defaultPlanners) {
      return;
    }

    const defaultPlanner = {
      ..._defaultPlanners[current],
      id: uuid4(),
    };

    saveAll({ userId: userId!, planners: [clonePlanner(defaultPlanner)] });
  }

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
          setApi={setApi}
        />
      )}

      <div className="max-w-lg w-full">
        <ContinueButton onClick={() => handleClickUseTemplate()}>
          Use this template
        </ContinueButton>
      </div>
    </div>
  );
}

function CurriculumSelectCarousel({
  program,
  setApi,
}: {
  program: Program;
  setApi: (api: CarouselApi) => void;
}) {
  const [selectedPlannerTitle, setSelectedPlannerTitle] =
    useState<PlannerTitle>();

  // Fetch default planners for the program
  const {
    data: _defaultPlanners,
    isPending: defaultPlannersIsPending,
    isFetching: defaultPlannersIsFetching,
  } = useProgramDefaultPlanners(program.name, program.catalogYear);

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
    <Carousel className="flex w-1/2 p-5" setApi={setApi}>
      <CarouselContent>
        {defaultPlanners!.map((planner, index) => (
          <CarouselItem key={index} className="flex items-start justify-start">
            <MiniPlanner plannerState={planner} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

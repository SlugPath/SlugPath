"use client";

import ContinueButton from "@/app/components/buttons/ContinueButton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/app/components/miscellaneous/Carousel";
import CourseInfoModal from "@/app/components/modals/courseInfoModal/CourseInfoModal";
import { CourseInfoProvider } from "@/app/contexts/CourseInfoProvider";
import { PlannerProvider } from "@/app/contexts/PlannerProvider";
import {
  // useAddNewPlannerMutation,
  usePlanners,
  useProgramDefaultPlanners,
  useUpdatePlannersMutation,
  useUserPrograms,
} from "@/app/hooks/reactQuery";
import { PlannerData, PlannerTitle } from "@/app/types/Planner";
import { Program } from "@/app/types/Program";
import { cloneDefaultPlanner } from "@/lib/plannerUtils";
import { CircularProgress, Option, Select } from "@mui/joy";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import MiniPlanner from "./MiniPlanner";

export default function CurriculumSelect() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const userId = session?.user.id;
  const router = useRouter();

  const [selectedPlanner, setSelectedPlanner] = useState<number | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  const [loadingPage, setLoadingPage] = useState(false);

  // Fetch user programs
  const {
    data: userPrograms,
    isPending: userProgramsIsPending,
    isFetching: userProgramsIsFetching,
  } = useUserPrograms(userId);

  const { data: planners } = usePlanners(userId);

  const { mutate: addNewPlannerMutation } = useAddNewPlannerMutation(
    userId,
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

  function handleUpdatePlannersSuccess() {
    queryClient.invalidateQueries({ queryKey: ["planners", userId] });
    setLoadingPage(true);

    // Successful invalidating the queries seems to only work with a delay
    // invalidating { queryKey: ["planners", userId] } causes correct fetching of
    // newly added planner.
    setTimeout(() => {
      setLoadingPage(false);
      router.push("/planner");
    }, 500);
  }

  function handleClickUseTemplate() {
    if (!_defaultPlanners || !planners || selectedPlanner == null) {
      return;
    }

    const defaultPlanner = _defaultPlanners[selectedPlanner];

    addNewPlannerMutation({
      userId,
      planner: cloneDefaultPlanner(defaultPlanner),
    });
  }

  return (
    <div className="flex-1 h-full w-full flex flex-col items-center justify-center p-5">
      <PlannerProvider plannerId={""} title={""} order={0}>
        <CourseInfoProvider>
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
              setSelectedPlanner={setSelectedPlanner}
              selectedPlanner={selectedPlanner}
            />
          )}

          <div className="max-w-lg w-full">
            <ContinueButton
              onClick={() => handleClickUseTemplate()}
              disabled={selectedPlanner == null}
              loading={loadingPage}
            >
              Use this template
            </ContinueButton>
          </div>
          <CourseInfoModal />
        </CourseInfoProvider>
      </PlannerProvider>
    </div>
  );
}

function CurriculumSelectCarousel({
  program,
  setSelectedPlanner,
  selectedPlanner,
}: {
  program: Program;
  setSelectedPlanner: (index: number) => void;
  selectedPlanner: number | null;
}) {
  const [selectedPlannerTitle, setSelectedPlannerTitle] =
    useState<PlannerTitle>();

  // Fetch default planners for the program
  const {
    data: defaultPlanners,
    isPending: defaultPlannersIsPending,
    isFetching: defaultPlannersIsFetching,
  } = useProgramDefaultPlanners(program.name, program.catalogYear);

  const isDefaultPlannersLoading =
    defaultPlannersIsPending || defaultPlannersIsFetching;

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
    <Carousel className="flex w-5/6 p-5">
      <CarouselContent className="w-2/4">
        {defaultPlanners!.map((planner, index) => (
          <CarouselItem key={index} className="flex items-start justify-start">
            <MiniPlanner
              plannerState={planner}
              onSelected={() => setSelectedPlanner(index)}
              selected={index == selectedPlanner}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

function useAddNewPlannerMutation(
  userId: string | undefined,
  onSuccess?: () => void,
) {
  const { data: planners } = usePlanners(userId);
  const { mutate: saveAll } = useUpdatePlannersMutation(onSuccess);

  async function addNewPlanner({
    userId,
    planner,
  }: {
    userId: string | undefined;
    planner: PlannerData;
  }) {
    if (!planners) return;

    const id = uuidv4();

    const newPlanners = planners.concat({
      ...cloneDefaultPlanner(planner!),
      id,
      title: "New Planner",
    });

    await saveAll({ userId: userId!, planners: newPlanners });
  }

  return useMutation({
    mutationFn: async (params: {
      userId: string | undefined;
      planner: PlannerData;
    }) => await addNewPlanner(params),
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
}

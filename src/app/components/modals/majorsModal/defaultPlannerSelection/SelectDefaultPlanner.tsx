import { useUserProgramDefaultPlanners } from "@/app/hooks/reactQuery";
import { PlannerTitle } from "@/app/types/Planner";
import { Program } from "@/app/types/Program";
import Info from "@mui/icons-material/Info";
import { Tab, TabList, Tabs, Tooltip, Typography } from "@mui/joy";
import { CircularProgress } from "@mui/material";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import MiniPlanner from "../majorSelection/miniPlanner/MiniPlanner";

export interface SelectDefaultPlannerProps {
  program: Program;
}

export default function SelectDefaultPlanner({
  program,
}: SelectDefaultPlannerProps) {
  const { data: session } = useSession();
  const userId = session?.user.id;

  const [selectedPlannerTitle, setSelectedPlannerTitle] =
    useState<PlannerTitle>();

  // Fetch default planners for the program
  const {
    data: defaultPlanners,
    isPending: defaultPlannersIsPending,
    isFetching: defaultPlannersIsFetching,
  } = useUserProgramDefaultPlanners(userId, program);

  const isDefaultPlannersLoading =
    defaultPlannersIsPending || defaultPlannersIsFetching;

  // Handlers
  const handleProgramChange = (
    _: React.SyntheticEvent | null,
    newValue: string | number | null,
  ) => {
    if (typeof newValue !== "string") return;

    setSelectedPlannerTitle(
      defaultPlanners?.find((planner) => planner.id === newValue),
    );
  };

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

  return (
    <>
      <div className="flex flex-row space-x-2 items-center">
        <Typography level="body-lg">Default Planner</Typography>
        <Tooltip title="The default planner you select will be used to auto-fill classes into your planner">
          <Info sx={{ color: "gray" }} />
        </Tooltip>
      </div>
      <div className="space-y-2">
        <Tabs
          value={selectedPlannerTitle?.id ?? null}
          variant="soft"
          onChange={handleProgramChange}
        >
          <TabList>
            {defaultPlanners?.map((planner) => (
              <Tab key={planner.title} value={planner.id}>
                {planner.title}
              </Tab>
            ))}
          </TabList>
        </Tabs>

        {isDefaultPlannersLoading && (
          <div className="h-40 w-full flex items-center justify-center">
            <CircularProgress size={24} />
          </div>
        )}

        {/* TOOD: empty state / error state */}
        {!isDefaultPlannersLoading && selectedPlannerTitle && (
          <MiniPlanner plannerId={selectedPlannerTitle.id} active={true} />
        )}
      </div>
    </>
  );
}

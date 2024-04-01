"use client";

import { Requirements } from "@/app/components/modals/majorsModal/Requirements";
import DefaultPlannerSelection from "@/app/components/modals/majorsModal/defaultPlannerSelection/DefaultPlannerSelection";
import UserProgramsEditor from "@/app/components/modals/majorsModal/majorSelection/MajorSelection";
import {
  MajorVerificationContext,
  MajorVerificationProvider,
} from "@/app/contexts/MajorVerificationProvider";
import { PlannerProvider } from "@/app/contexts/PlannerProvider";
import {
  PlannersContext,
  PlannersProvider,
} from "@/app/contexts/PlannersProvider";
import { useUserPermissions, useUserPrograms } from "@/app/hooks/reactQuery";
import { Program } from "@/app/types/Program";
import {
  extractUnexpiredPrograms,
  hasPermissionToEditProgram,
} from "@/lib/permissionsUtils";
import { Card, Typography } from "@mui/joy";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useMemo } from "react";

export default function Majors() {
  return (
    <PlannersProvider>
      <MajorVerificationProvider>
        <MidComponent />
      </MajorVerificationProvider>
    </PlannersProvider>
  );
}

function MidComponent() {
  const { activePlanner } = useContext(PlannersContext);

  if (activePlanner === undefined) return <div></div>;

  return (
    <PlannerProvider plannerId={activePlanner} title={""} order={0}>
      <MajorAndPlannerSelection isInPlannerPage={false} />
    </PlannerProvider>
  );
}

// TODO: Loading states from react-query
function MajorAndPlannerSelection({
  isInPlannerPage,
  onSavedDefaultPlanner,
}: {
  isInPlannerPage: boolean;
  onSavedDefaultPlanner?: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const userId = session?.user.id;

  const { getRequirementsForMajor } = useContext(MajorVerificationContext);

  // Fetch programsAllowedToEdit
  const { data: userPermissions } = useUserPermissions(userId);

  const programsAllowedToEdit = useMemo(
    () => extractUnexpiredPrograms(userPermissions),
    [userPermissions],
  );

  // Fetch user programs
  const { data: userPrograms } = useUserPrograms(userId);

  function handleClickEditRequirements(major: Program) {
    router.push(pathname + "/program-requirements/" + major.id);
  }

  const handleSave = () => {
    if (onSavedDefaultPlanner) onSavedDefaultPlanner();
  };

  return (
    <div className="flex-row space-x-3 grid grid-cols-7 w-full p-3">
      <div className="flex flex-col overflow-y-scroll h-[80vh] col-span-3 gap-3">
        <UserProgramsEditor />
        <div className="space-y-3 w-full">
          {userPrograms &&
            userPrograms.map((program, index) => {
              const majorRequirements = getRequirementsForMajor(program.id);

              if (majorRequirements === undefined) {
                return (
                  <Card key={index}>
                    Missing requirements for {program.name}{" "}
                    {program.catalogYear}. Reloading the page may help.
                  </Card>
                );
              }

              return (
                <Requirements
                  key={index}
                  major={program}
                  requirements={majorRequirements}
                  parents={0}
                  hideTitle={false}
                  hasEditPermission={hasPermissionToEditProgram(
                    program,
                    programsAllowedToEdit,
                  )}
                  onClickEdit={handleClickEditRequirements}
                />
              );
            })}
        </div>
      </div>
      <Card variant="soft" className="col-span-4">
        <Typography
          level="h4"
          className="flex flex-col space-y-2 justify-between mb-2"
        >
          My Default Planner
        </Typography>
        <DefaultPlannerSelection
          onSaved={handleSave}
          saveButtonName={isInPlannerPage ? "Save" : "Next"}
          isInPlannerPage={isInPlannerPage}
        />
      </Card>
    </div>
  );
}

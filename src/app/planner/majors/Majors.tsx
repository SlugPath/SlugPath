"use client";

import { Requirements } from "@/app/components/modals/majors/Requirements";
import UserProgramsEditor from "@/app/components/modals/majors/majorSelection/MajorSelection";
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
import { Card } from "@mui/joy";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useMemo } from "react";

export default function Majors() {
  return (
    <PlannersProvider>
      <MajorVerificationProvider>
        <SelectionContainer />
      </MajorVerificationProvider>
    </PlannersProvider>
  );
}

function SelectionContainer() {
  const { activePlanner } = useContext(PlannersContext);

  if (activePlanner === undefined) return <></>;

  return (
    <PlannerProvider plannerId={activePlanner} title={""} order={0}>
      <MajorAndPlannerSelection />
    </PlannerProvider>
  );
}

// TODO: Loading states from react-query
function MajorAndPlannerSelection() {
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

  return (
    <div className="flex justify-between space-x-4 w-full min-h-0 p-3">
      <UserProgramsEditor />
      <div className="overflow-auto w-full flex-grow max-h-full space-y-4">
        {userPrograms &&
          userPrograms.map((program, index) => {
            const majorRequirements = getRequirementsForMajor(program.id);

            if (majorRequirements === undefined) {
              return (
                <Card key={index}>
                  Missing requirements for {program.name} {program.catalogYear}.
                  Reloading the page may help.
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
  );
}

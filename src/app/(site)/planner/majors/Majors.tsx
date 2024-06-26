"use client";

import { Program } from "@/app/types/Program";
import {
  extractUnexpiredPrograms,
  hasPermissionToEditProgram,
} from "@/lib/permissionsUtils";
import usePlannersStore from "@/store/planner";
import CourseInfoModal from "@components/modals/courseInfoModal/CourseInfoModal";
import { CourseInfoProvider } from "@contexts/CourseInfoProvider";
import { MajorVerificationContext } from "@contexts/MajorVerificationProvider";
import { useUserPermissions, useUserPrograms } from "@hooks/reactQuery";
import { Card } from "@mui/joy";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useMemo } from "react";

import { Requirements } from "../majors/Requirements";
import UserProgramsEditor from "../majors/majorSelection/MajorSelection";

export default function Majors() {
  const planners = usePlannersStore((state) => state.planners);
  const activePlannerId = usePlannersStore((state) => state.activePlannerId);

  const activePlanner = useMemo(
    () => planners.find((planner) => planner.id === activePlannerId),
    [planners, activePlannerId],
  );

  if (activePlanner === undefined) return <></>;

  return <MajorAndPlannerSelection />;
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

  const isMobileView = useMediaQuery("(max-width: 800px)");

  function handleClickEditRequirements(major: Program) {
    router.push(pathname + "/program-requirements/" + major.id);
  }

  return (
    <div className="flex justify-between space-x-4 w-full min-h-0 p-3">
      <CourseInfoProvider>
        <UserProgramsEditor />
        {!isMobileView && (
          <div className="overflow-auto w-full flex-grow max-h-full space-y-4">
            {userPrograms?.map((program, index) => {
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

            <CourseInfoModal />
          </div>
        )}
      </CourseInfoProvider>
    </div>
  );
}

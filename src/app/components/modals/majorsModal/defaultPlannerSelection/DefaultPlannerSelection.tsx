import ConfirmAlert from "@/app/components/modals/ConfirmAlert";
import CourseInfoModal from "@/app/components/modals/courseInfoModal/CourseInfoModal";
import { ModalsContext } from "@/app/contexts/ModalsProvider";
import { PlannersContext } from "@/app/contexts/PlannersProvider";
import { useUserPrograms } from "@/app/hooks/reactQuery";
import { Program } from "@/app/types/Program";
import {
  Button,
  CircularProgress,
  Option,
  Select,
  Tooltip,
  Typography,
} from "@mui/joy";
import { useSession } from "next-auth/react";
import { useContext, useEffect, useState } from "react";

import SelectDefaultPlanner from "./SelectDefaultPlanner";

export default function DefaultPlannerSelection() {
  const { data: session } = useSession();
  const userId = session?.user.id;

  // Modal state
  const [replaceAlertOpen, setReplaceAlertOpen] = useState(false);
  const { setShowMajorsModal } = useContext(ModalsContext);

  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  // Fetch user programs
  const {
    data: userPrograms,
    isPending: userProgramsIsPending,
    isFetching: userProgramsIsFetching,
  } = useUserPrograms(userId);

  const isUserProgramsLoading = userProgramsIsPending || userProgramsIsFetching;
  const isUserProgramsEmpty = !(userPrograms && userPrograms.length > 0);

  // Planner mutation functions
  const { addPlanner, replaceCurrentPlanner } = useContext(PlannersContext);

  // Handlers
  function handleConfirmReplaceCurrent() {
    replaceCurrentPlanner();
    setReplaceAlertOpen(false);
    setShowMajorsModal(false);
  }

  function handleClickCreateNew() {
    addPlanner();
    setShowMajorsModal(false);
  }

  function handleClickReplaceCurrent() {
    setReplaceAlertOpen(true);
  }

  // Set the first program as the selected program
  useEffect(() => {
    if (!selectedProgram && userPrograms && userPrograms.length > 0) {
      setSelectedProgram(userPrograms![0]);
    }
  }, [userPrograms, selectedProgram]);

  return (
    <>
      <ConfirmAlert
        open={replaceAlertOpen}
        onClose={() => setReplaceAlertOpen(false)}
        onConfirm={handleConfirmReplaceCurrent}
        dialogText="Are you sure you want to replace your current planner? Your notes and courses will be deleted."
      />

      <div className="w-full">
        <div className="overflow-y-scroll h-[70vh] space-y-2">
          <div>
            <Typography level="body-lg">Program</Typography>
            <Select
              placeholder="Choose one…"
              variant="plain"
              value={selectedProgram}
              onChange={(_, newValue) =>
                newValue != null && setSelectedProgram(newValue)
              }
              disabled={isUserProgramsLoading || isUserProgramsEmpty}
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
          </div>
          {!isUserProgramsEmpty && selectedProgram && (
            <SelectDefaultPlanner
              key={selectedProgram.id}
              program={selectedProgram}
            />
          )}
          <CourseInfoModal />
        </div>

        {/* Buttons */}
        <div className="flex justify-end w-full gap-4">
          <Tooltip title="Replace your currently selected planner with the courses in your default planner.">
            <Button color="warning" onClick={handleClickReplaceCurrent}>
              Replace Current Planner
            </Button>
          </Tooltip>
          <Tooltip title="Create a new planner with the courses in your default planner.">
            <Button color="success" onClick={handleClickCreateNew}>
              Create New Planner
            </Button>
          </Tooltip>
        </div>
      </div>
    </>
  );
}

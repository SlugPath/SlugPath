import ConfirmAlert from "@/app/components/modals/ConfirmAlert";
import CourseInfoModal from "@/app/components/modals/courseInfoModal/CourseInfoModal";
import { PlannersContext } from "@/app/contexts/PlannersProvider";
import {
  useUpdateUserDefaultPlannerIdMutation,
  useUserDefaultPlannerId,
  useUserPrimaryProgram,
  useUserProgramDefaultPlanners,
  useUserPrograms,
} from "@/app/hooks/reactQuery";
import { Program } from "@/app/types/Program";
import ReportIcon from "@mui/icons-material/Report";
import {
  Alert,
  Button,
  CircularProgress,
  Option,
  Select,
  Tooltip,
  Typography,
} from "@mui/joy";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useContext, useEffect, useState } from "react";

import SelectDefaultPlanner from "./SelectDefaultPlanner";

enum ButtonName {
  Save = "Save",
  CreateNew = "Create New Planner",
  ReplaceCurrent = "Replace Current Planner",
}

export interface DefaultPlannerSelectionProps {
  onSaved: () => void;
  saveButtonName: string;
  isInPlannerPage?: boolean;
}

// NOTE: This component is currently broken, as setPrimaryMajor has no state.
// The issue is that the primary major is not stored in the database, so need
// to make a decision if the state should belong to the client or the server.
// TODO: just grab 0th planner
export default function DefaultPlannerSelection({
  saveButtonName,
  onSaved,
  isInPlannerPage,
}: DefaultPlannerSelectionProps) {
  const { data: session } = useSession();
  const userId = session?.user.id;

  const [saveButtonClicked, setSaveButtonClicked] = useState<ButtonName>(
    ButtonName.Save,
  );
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState("");

  // Primary program
  const { data: primaryProgram } = useUserPrimaryProgram(userId);
  const { data: defaultPlannerId } = useUserDefaultPlannerId(userId);
  const {
    data: programDefaultPlanners,
    isLoading: loadingProgramDefaultPlanners,
  } = useUserProgramDefaultPlanners(userId, primaryProgram);

  const {
    mutate: updateDefaultPlanner,
    isPending: updateDefaultPlannerIsPending,
  } = useUpdateUserDefaultPlannerIdMutation();

  // TODO: Deeper issue here as mentioned above. Should be react-query mutation if server state,
  // however, no current database storage for primary major. Unclear if this
  // state should be persisted on server, or if it should be stored in local
  // storage.
  const setPrimaryMajor = useCallback(
    (program: Program | null) =>
      console.warn(`setPrimaryMajor currently unimplemented ${program}`),
    [],
  );

  const setDefaultPlannerId = (plannerId: string) =>
    alert(`setDefaultPlannerId currently unimplemented ${plannerId}`);

  const { data: userPrograms } = useUserPrograms(session?.user.id);

  const { addPlanner, replaceCurrentPlanner } = useContext(PlannersContext);
  const [replaceAlertOpen, setReplaceAlertOpen] = useState(false);

  const router = useRouter();

  function handleChangeSelectedMajor(
    _: React.SyntheticEvent | null,
    newValue: Program | null,
  ) {
    if (newValue != null) {
      setPrimaryMajor(newValue);
      setIsSaved(false);
    }
  }

  function handleChangeDefaultPlanner(
    _: React.SyntheticEvent | null,
    plannerId: string | number | null,
  ) {
    if (typeof plannerId === "string") {
      setDefaultPlannerId(plannerId);
      setIsSaved(false);
    }
  }

  // Handlers
  useEffect(() => {
    if (updateDefaultPlannerIsPending && defaultPlannerId !== undefined) {
      setIsSaved(true);
      onSaved();
      switch (saveButtonClicked) {
        case ButtonName.CreateNew:
          addPlanner();
          break;
        case ButtonName.ReplaceCurrent:
          replaceCurrentPlanner();
      }
    }
  }, [
    saveButtonClicked,
    updateDefaultPlannerIsPending,
    addPlanner,
    replaceCurrentPlanner,
    onSaved,
    defaultPlannerId,
  ]);

  function handleSave(buttonName: ButtonName) {
    if (defaultPlannerId === undefined || defaultPlannerId === null) {
      setError(
        "Please select your majors, then choose a primary major and a default planner.",
      );
      return;
    }
    setError("");
    updateDefaultPlanner({ userId: userId!, defaultPlannerId });
    setSaveButtonClicked(buttonName);
  }

  function handleConfirmReplaceCurrent() {
    handleSave(ButtonName.ReplaceCurrent);
    setReplaceAlertOpen(false);
  }

  function handleClickSave() {
    handleSave(ButtonName.Save);
  }

  function handleClickReplaceCurrent() {
    setReplaceAlertOpen(true);
  }

  function handleClickCreateNew() {
    handleSave(ButtonName.CreateNew);
  }

  // Set the primary major to the instance of the corresponding majors
  // in userMajors, because the references are different even though
  // the values are the same
  useEffect(() => {
    if (primaryProgram && userPrograms && userPrograms.length > 0) {
      const found =
        userPrograms.find((m) => m.id === primaryProgram.id) ?? null;
      setPrimaryMajor(found);
    }
  }, [primaryProgram, userPrograms, setPrimaryMajor]);

  return (
    <div className="w-full">
      <ConfirmAlert
        open={replaceAlertOpen}
        onClose={() => setReplaceAlertOpen(false)}
        onConfirm={handleConfirmReplaceCurrent}
        dialogText="Are you sure you want to replace your current planner? Your notes and courses will be deleted."
      />
      <div className="overflow-y-scroll h-[70vh] space-y-2">
        {error.length > 0 && (
          <Alert color="danger" startDecorator={<ReportIcon />}>
            {error}
          </Alert>
        )}
        <div>
          <Typography level="body-lg">Primary Program</Typography>
          <Select
            placeholder="Choose one…"
            variant="plain"
            value={primaryProgram}
            onChange={handleChangeSelectedMajor}
            disabled={!userPrograms || userPrograms.length === 0}
          >
            {userPrograms &&
              userPrograms.map((major, index) => (
                <Option key={index} value={major}>
                  {major.name} {major.catalogYear}
                </Option>
              ))}
          </Select>
        </div>
        {userPrograms && userPrograms.length > 0 && primaryProgram && (
          <SelectDefaultPlanner
            selectedDefaultPlanner={defaultPlannerId ?? undefined}
            onChange={handleChangeDefaultPlanner}
            majorDefaultPlanners={programDefaultPlanners}
            loadingMajorDefaultPlanners={loadingProgramDefaultPlanners}
          />
        )}
        <CourseInfoModal />
      </div>
      <div className="flex justify-end w-full gap-4">
        {updateDefaultPlannerIsPending ? (
          <CircularProgress variant="plain" color="primary" />
        ) : (
          <>
            <Button disabled={isSaved} onClick={handleClickSave}>
              {saveButtonName}
            </Button>
            {!isInPlannerPage ? (
              <Tooltip title="Skip to planner dashboard without selecting a default planner.">
                <Button color="danger" onClick={() => router.push("/planner")}>
                  Skip
                </Button>
              </Tooltip>
            ) : (
              <>
                <Tooltip title="Replace your currently selected planner with the courses in your default planner.">
                  <Button color="warning" onClick={handleClickReplaceCurrent}>
                    {ButtonName.ReplaceCurrent}
                  </Button>
                </Tooltip>
                <Tooltip title="Create a new planner with the courses in your default planner.">
                  <Button color="success" onClick={handleClickCreateNew}>
                    {ButtonName.CreateNew}
                  </Button>
                </Tooltip>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

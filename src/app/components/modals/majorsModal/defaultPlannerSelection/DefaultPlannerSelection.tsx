import ConfirmAlert from "@/app/components/modals/ConfirmAlert";
import CourseInfoModal from "@/app/components/modals/courseInfoModal/CourseInfoModal";
import { PlannersContext } from "@/app/contexts/PlannersProvider";
import { Major } from "@/app/types/Major";
import { DefaultPlannerContext } from "@contexts/DefaultPlannerProvider";
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
import { useContext, useEffect, useState } from "react";

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
  onReplacePlanner?: () => void;
}

export default function DefaultPlannerSelection({
  saveButtonName,
  onSaved,
  isInPlannerPage,
  onReplacePlanner,
}: DefaultPlannerSelectionProps) {
  const [saveButtonClicked, setSaveButtonClicked] = useState<ButtonName>(
    ButtonName.Save,
  );
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState("");
  const {
    primaryMajor,
    setPrimaryMajor,
    userMajors,
    defaultPlannerId,
    setDefaultPlannerId,
    updateDefaultPlanner,
    updateDefaultPlannerIsPending,
    majorDefaultPlanners,
    loadingMajorDefaultPlanners,
  } = useContext(DefaultPlannerContext);
  const { addPlanner, replaceCurrentPlanner } = useContext(PlannersContext);
  const [replaceAlertOpen, setReplaceAlertOpen] = useState(false);

  function handleChangeSelectedMajor(
    _: React.SyntheticEvent | null,
    newValue: Major | null,
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
      switch (saveButtonClicked) {
        case ButtonName.Save:
          setIsSaved(true);
          onSaved();
          break;
        // These are slightly delayed to allow the save to complete
        // before the new planner is created or replaced
        case ButtonName.CreateNew:
          setIsSaved(true);
          addPlanner();
          break;
        case ButtonName.ReplaceCurrent:
          setIsSaved(true);
          if (onReplacePlanner) onReplacePlanner();
          replaceCurrentPlanner();
      }
    }
  }, [
    saveButtonClicked,
    updateDefaultPlannerIsPending,
    addPlanner,
    replaceCurrentPlanner,
    onReplacePlanner,
    onSaved,
    defaultPlannerId,
  ]);

  function handleSave(buttonName: ButtonName) {
    if (defaultPlannerId === undefined) {
      setError(
        "Please select your majors, then choose a primary major and a default planner.",
      );
      return;
    }
    setError("");
    updateDefaultPlanner(defaultPlannerId);
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

  const ErrorAlert = () => (
    <div>
      {error.length > 0 && (
        <Alert color="danger" startDecorator={<ReportIcon />}>
          {error}
        </Alert>
      )}
    </div>
  );

  // Set the primary major to the instance of the corresponding majors
  // in userMajors, because the references are different even though
  // the values are the same
  useEffect(() => {
    if (primaryMajor) {
      const found = userMajors.find((m) => m.id === primaryMajor.id) ?? null;
      setPrimaryMajor(found);
    }
  }, [primaryMajor, userMajors, setPrimaryMajor]);

  return (
    <div className="w-full">
      <ConfirmAlert
        open={replaceAlertOpen}
        onClose={() => setReplaceAlertOpen(false)}
        onConfirm={handleConfirmReplaceCurrent}
        dialogText="Are you sure you want to replace your current planner? Your notes and courses will be deleted."
      />
      <div className="overflow-y-scroll h-[70vh] space-y-2">
        {error.length > 0 && <ErrorAlert />}
        <div>
          <Typography level="body-lg">Primary Program</Typography>
          <Select
            placeholder="Choose one…"
            variant="plain"
            value={primaryMajor}
            onChange={handleChangeSelectedMajor}
            disabled={userMajors.length === 0}
          >
            {userMajors.map((major, index) => (
              <Option key={index} value={major}>
                {major.name} {major.catalogYear}
              </Option>
            ))}
          </Select>
        </div>
        {userMajors.length > 0 && primaryMajor && (
          <SelectDefaultPlanner
            selectedDefaultPlanner={defaultPlannerId}
            onChange={handleChangeDefaultPlanner}
            majorDefaultPlanners={majorDefaultPlanners}
            loadingMajorDefaultPlanners={loadingMajorDefaultPlanners}
            addPlannerCardContainer={isInPlannerPage}
          />
        )}
        <CourseInfoModal />
      </div>
      <div className="flex justify-end w-full">
        {updateDefaultPlannerIsPending ? (
          <CircularProgress variant="plain" color="primary" />
        ) : (
          <div>
            <Button disabled={isSaved} onClick={handleClickSave}>
              {saveButtonName}
            </Button>
            {isInPlannerPage && (
              <>
                <Tooltip title="Replace your currently selected planner with the courses in your default planner.">
                  <Button color="warning" onClick={handleClickReplaceCurrent}>
                    {ButtonName.ReplaceCurrent}
                  </Button>
                </Tooltip>
                <Tooltip title="Create a new planner with the courses in your default planner.">
                  <Button onClick={handleClickCreateNew}>
                    {ButtonName.CreateNew}
                  </Button>
                </Tooltip>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

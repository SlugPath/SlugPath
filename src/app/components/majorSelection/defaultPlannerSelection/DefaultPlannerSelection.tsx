import { PlannersContext } from "@/app/contexts/PlannersProvider";
import { Major } from "@/app/types/Major";
import { DefaultPlannerContext } from "@contexts/DefaultPlannerProvider";
import { Button, CircularProgress, Option, Select, Typography } from "@mui/joy";
import { useContext, useEffect, useState } from "react";

import ConfirmAlert from "../../modals/ConfirmAlert";
import CourseInfoModal from "../../modals/courseInfoModal/CourseInfoModal";
import SelectDefaultPlanner from "./SelectDefaultPlanner";

enum ButtonName {
  Save = "Save",
  CreateNew = "Create New",
  ReplaceCurrent = "Replace Current",
}

export interface DefaultPlannerSelectionProps {
  onSaved: () => void;
  saveButtonName: string;
  isInPlannerPage?: boolean;
}

export default function DefaultPlannerSelection({
  saveButtonName,
  onSaved,
  isInPlannerPage,
}: DefaultPlannerSelectionProps) {
  const [saveButtonClicked, setSaveButtonClicked] = useState<ButtonName>(
    ButtonName.Save,
  );
  const [isSaved, setIsSaved] = useState(false);

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

  // if primaryMajor is present, set selectedMajor to primaryMajor
  useEffect(() => {
    if (primaryMajor) {
      for (const major of userMajors) {
        if (major.id === primaryMajor.id) {
          setPrimaryMajor(major);
          break;
        }
      }
    }
  }, [primaryMajor, setPrimaryMajor, userMajors]);

  function handleChangeSelectedMajor(
    event: React.SyntheticEvent | null,
    newValue: Major | null,
  ) {
    if (newValue != null) {
      setPrimaryMajor(newValue);
      setIsSaved(false);
    }
  }

  function handleChangeDefaultPlanner(
    event: React.SyntheticEvent | null,
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
          setTimeout(() => {
            addPlanner();
          }, 200);
          break;
        case ButtonName.ReplaceCurrent:
          setIsSaved(true);
          setTimeout(() => {
            replaceCurrentPlanner();
          }, 200);
          break;
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
    if (defaultPlannerId === undefined) return;
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

  return (
    <div className="space-y-4 w-full">
      <ConfirmAlert
        open={replaceAlertOpen}
        onClose={() => setReplaceAlertOpen(false)}
        onConfirm={handleConfirmReplaceCurrent}
        dialogText="Are you sure you want to replace your current planner? Your notes and courses will be deleted."
      />
      <div className="overflow-y-scroll h-[70vh]">
        <Typography level="body-lg">Primary Major</Typography>
        <Select
          value={primaryMajor}
          placeholder="Choose one…"
          variant="plain"
          onChange={handleChangeSelectedMajor}
        >
          {userMajors.map((major, index) => (
            <Option key={index} value={major}>
              {major.name} {major.catalogYear}
            </Option>
          ))}
        </Select>
        <SelectDefaultPlanner
          selectedDefaultPlanner={defaultPlannerId}
          onChange={handleChangeDefaultPlanner}
          majorDefaultPlanners={majorDefaultPlanners}
          loadingMajorDefaultPlanners={loadingMajorDefaultPlanners}
          addPlannerCardContainer={isInPlannerPage}
        />
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
                <Button color="warning" onClick={handleClickReplaceCurrent}>
                  Replace Current
                </Button>
                <Button onClick={handleClickCreateNew}>Create New</Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

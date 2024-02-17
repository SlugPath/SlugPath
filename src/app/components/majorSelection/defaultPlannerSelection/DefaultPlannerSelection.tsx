import { PlannersContext } from "@/app/contexts/PlannersProvider";
import { Major } from "@/app/types/Major";
import { DefaultPlannerContext } from "@contexts/DefaultPlannerProvider";
import { ModalsProvider } from "@contexts/ModalsProvider";
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
  onSkip?: () => void;
}

export default function DefaultPlannerSelection({
  saveButtonName,
  onSaved,
  isInPlannerPage,
  onSkip,
}: DefaultPlannerSelectionProps) {
  const [saveButtonClicked, setSaveButtonClicked] = useState<ButtonName>(
    ButtonName.Save,
  );
  const [isSaved, setIsSaved] = useState(false);

  // selected major which is used to fetch majorDefaultPlanners
  // const [selectedMajor, setSelectedMajor] = useState<Major>({} as Major);

  const {
    selectedMajor,
    setSelectedMajor,
    userMajors,
    primaryMajor,
    defaultPlannerId,
    // defaultPlannerIdIsPending,
    updateDefaultPlanner,
    updateDefaultPlannerIsPending,
    majorDefaultPlanners,
    loadingMajorDefaultPlanners,
  } = useContext(DefaultPlannerContext);
  const { addPlanner, replaceCurrentPlanner } = useContext(PlannersContext);
  const [selectedDefaultPlanner, setSelectedDefaultPlanner] = useState(
    defaultPlannerId || "",
  );

  const [replaceAlertOpen, setReplaceAlertOpen] = useState(false);

  // if primaryMajor is present, set selectedMajor to primaryMajor
  useEffect(() => {
    if (primaryMajor) {
      for (const major of userMajors) {
        if (major.id === primaryMajor.id) {
          setSelectedMajor(major);
          break;
        }
      }
    }
  }, [primaryMajor, setSelectedMajor, userMajors]);

  useEffect(() => {
    /**
     * Set selectedDefaultPlanner to first majorDefaultPlanner when majorDefaultPlanners changes
     * if selectedDefaultPlanner is not present in new majorDefaultPlanners
     * so that default planner tabs work correctly
     */
    function updateSelectedDefaultPlanner() {
      if (majorDefaultPlanners !== undefined) {
        const plannerIds = majorDefaultPlanners.map((planner) => planner.id);
        if (!plannerIds.includes(selectedDefaultPlanner)) {
          setSelectedDefaultPlanner(majorDefaultPlanners[0]?.id);
        }
      }
    }

    updateSelectedDefaultPlanner();
  }, [majorDefaultPlanners, selectedDefaultPlanner]);

  function handleChangeSelectedMajor(
    event: React.SyntheticEvent | null,
    newValue: Major | null,
  ) {
    if (newValue != null) {
      setSelectedMajor(newValue);
    }
  }

  function handleChangeDefaultPlanner(
    event: React.SyntheticEvent | null,
    plannerId: string | number | null,
  ) {
    if (typeof plannerId === "string") {
      setSelectedDefaultPlanner(plannerId);
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
            console.log("add planner");
            addPlanner();
          }, 200);
          break;
        case ButtonName.ReplaceCurrent:
          setIsSaved(true);
          setTimeout(() => {
            replaceCurrentPlanner();
            console.log("replace planner");
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
    updateDefaultPlanner(selectedDefaultPlanner);
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
        dialogText="Are you sure you want to replace your current planner?"
      />
      <div>
        <ModalsProvider>
          <Typography level="body-lg">Primary Major</Typography>
          <Typography level="body-lg">id: {defaultPlannerId}</Typography>
          <Select
            value={selectedMajor}
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
            selectedDefaultPlanner={selectedDefaultPlanner}
            onChange={handleChangeDefaultPlanner}
            majorDefaultPlanners={majorDefaultPlanners}
            loadingMajorDefaultPlanners={loadingMajorDefaultPlanners}
            addPlannerCardContainer={isInPlannerPage}
          />
          <CourseInfoModal />
        </ModalsProvider>
      </div>
      <div className="flex justify-end w-full">
        {updateDefaultPlannerIsPending ? (
          <CircularProgress variant="plain" color="primary" />
        ) : (
          <div>
            {onSkip && (
              <Button onClick={onSkip} variant="plain">
                Skip
              </Button>
            )}
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
          </div>
        )}
      </div>
    </div>
  );
}

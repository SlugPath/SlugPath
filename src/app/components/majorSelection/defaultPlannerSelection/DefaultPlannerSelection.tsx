import { Major } from "@/app/types/Major";
import { DefaultPlannerContext } from "@contexts/DefaultPlannerProvider";
import { ModalsProvider } from "@contexts/ModalsProvider";
import { CircularProgress, Select, Option, Typography, Button } from "@mui/joy";
import { useContext, useEffect, useState } from "react";
import ConfirmAlert from "../../modals/ConfirmAlert";
import CourseInfoModal from "../../modals/courseInfoModal/CourseInfoModal";
import useDefaultPlanners from "./../defaultPlannerSelection/useDefaultPlanners";
import SelectDefaultPlanner from "./SelectDefaultPlanner";
import { PlannersContext } from "@/app/contexts/PlannersProvider";

enum ButtonName {
  Save = "Save",
  CreateNew = "Create New",
  ReplaceCurrent = "Replace Current",
}

export interface DefaultPlannerSelectionProps {
  userMajors: Major[];
  onSaved: () => void;
  saveButtonName: string;
  isInPlannerPage?: boolean;
  onSkip?: () => void;
  major?: Major;
}

export default function DefaultPlannerSelection({
  userMajors,
  saveButtonName,
  onSaved,
  isInPlannerPage,
  onSkip,
  major,
}: DefaultPlannerSelectionProps) {
  const [saveButtonClicked, setSaveButtonClicked] = useState<ButtonName>(
    ButtonName.Save,
  );
  const [isSaved, setIsSaved] = useState(false);

  // selected major which is used to fetch majorDefaultPlanners
  const [selectedMajor, setSelectedMajor] = useState<Major>({} as Major);

  const { loadingDefaultPlanner, majorToAdd } = useContext(
    DefaultPlannerContext,
  );
  const { addPlanner, replaceCurrentPlanner } = useContext(PlannersContext);

  const {
    primaryMajor,
    majorDefaultPlanners,
    loadingMajorDefaultPlanners,
    updateDefaultPlanner,
    updateDefaultPlannerIsPending,
    defaultPlannerId,
  } = useDefaultPlanners(selectedMajor, handleSaveCompleted);
  const [selectedDefaultPlanner, setSelectedDefaultPlanner] = useState(defaultPlannerId || "");

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
  }, [primaryMajor]);

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

  // whenever userMajors changes, set selectedMajor to first major
  useEffect(() => {
    if (userMajors.length > 0) {
      setSelectedMajor(userMajors[0]);
    } else {
      setSelectedMajor(majorToAdd);
    }
  }, [userMajors, majorToAdd]);

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
  function handleSaveCompleted() {
    switch (saveButtonClicked) {
      case ButtonName.Save:
        setIsSaved(true);
        onSaved();
        break;
      // These are slightly delayed to allow the save to complete
      // before the new planner is created or replaced
      case ButtonName.CreateNew:
        if (!loadingDefaultPlanner) {
          setTimeout(() => {
            console.log("add planner")
            addPlanner();
          }, 200);
        }
        break;
      case ButtonName.ReplaceCurrent:
        if (!loadingDefaultPlanner) {
          setTimeout(() => {
            replaceCurrentPlanner();
            console.log("replace planner")
          }, 200);
        }
        break;
    }
  }

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
              <Button disabled={isSaved} onClick={handleClickSave}>{saveButtonName}</Button>
              {isInPlannerPage && (
                <>
                  <Button
                    color="warning"
                    onClick={handleClickReplaceCurrent}
                  >
                    Replace Current
                  </Button>
                  <Button
                    onClick={handleClickCreateNew}
                  >
                    Create New
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
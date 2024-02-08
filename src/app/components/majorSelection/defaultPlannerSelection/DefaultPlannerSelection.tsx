import { Major } from "@/app/types/Major";
import { DefaultPlannerContext } from "@contexts/DefaultPlannerProvider";
import { ModalsProvider } from "@contexts/ModalsProvider";
import { CircularProgress } from "@mui/joy";
import { useContext, useEffect, useState } from "react";

import ConfirmAlert from "../../modals/ConfirmAlert";
import CourseInfoModal from "../../modals/courseInfoModal/CourseInfoModal";
import SaveButtons from "./../SaveButtons";
import useDefaultPlanners from "./../defaultPlannerSelection/useDefaultPlanners";
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
  onCreateNewPlanner?: () => void;
  onReplaceCurrentPlanner?: () => void;
  major: Major;
}

export default function DefaultPlannerSelection({
  saveButtonName,
  onSaved,
  isInPlannerPage,
  onSkip,
  onCreateNewPlanner,
  onReplaceCurrentPlanner,
  major,
}: DefaultPlannerSelectionProps) {
  const [selectedDefaultPlanner, setSelectedDefaultPlanner] = useState("");
  const [saveButtonClicked, setSaveButtonClicked] = useState<ButtonName>(
    ButtonName.Save,
  );

  const { loadingMajorData, setDefaultPlannerId, loadingDefaultPlanner } =
    useContext(DefaultPlannerContext);

  const {
    majorDefaultPlanners,
    loadingMajorDefaultPlanners,
    updateDefaultPlannerIsPending,
    defaultPlannerId,
  } = useDefaultPlanners(major.catalogYear, major.name, handleSaveCompleted);

  const [replaceAlertOpen, setReplaceAlertOpen] = useState(false);

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
  }, [majorDefaultPlanners, selectedDefaultPlanner, defaultPlannerId]);

  function handleChangeDefaultPlanner(
    event: React.SyntheticEvent | null,
    plannerId: string | number | null,
  ) {
    if (typeof plannerId === "string") {
      setSelectedDefaultPlanner(plannerId);
    }
  }

  // Handlers
  function handleSaveCompleted() {
    switch (saveButtonClicked) {
      case ButtonName.Save:
        onSaved();
        break;
      // These are slightly delayed to allow the save to complete
      // before the new planner is created or replaced
      case ButtonName.CreateNew:
        if (onCreateNewPlanner && !loadingDefaultPlanner) {
          setTimeout(() => {
            onCreateNewPlanner();
          }, 200);
        }
        break;
      case ButtonName.ReplaceCurrent:
        if (onReplaceCurrentPlanner && !loadingDefaultPlanner) {
          setTimeout(() => {
            onReplaceCurrentPlanner();
          }, 200);
        }
        break;
    }
  }

  function handleSave(buttonName: ButtonName) {
    setSaveButtonClicked(buttonName);
    setDefaultPlannerId(selectedDefaultPlanner);
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

  if (loadingMajorData) {
    return <CircularProgress variant="plain" color="primary" />;
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
          <SaveButtons
            saveButtonName={saveButtonName}
            isInPlannerPage={isInPlannerPage}
            onSkip={onSkip}
            onClickSave={handleClickSave}
            onClickReplaceCurrent={handleClickReplaceCurrent}
            onClickCreateNew={handleClickCreateNew}
            majorSelectionIsValid={true}
          />
        )}
      </div>
    </div>
  );
}

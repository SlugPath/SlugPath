import { getAllMajorsByCatalogYear } from "@/app/actions/major";
import { years } from "@/lib/defaultPlanners";
import { DefaultPlannerContext } from "@contexts/DefaultPlannerProvider";
import { ModalsProvider } from "@contexts/ModalsProvider";
import ReportIcon from "@mui/icons-material/Report";
import { CircularProgress } from "@mui/joy";
import { Alert } from "@mui/joy";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useContext, useEffect, useMemo, useState } from "react";

import ConfirmAlert from "../modals/ConfirmAlert";
import CourseInfoModal from "../modals/courseInfoModal/CourseInfoModal";
import SaveButtons from "./SaveButtons";
import SelectCatalogYear from "./SelectCatalogYear";
import SelectDefaultPlanner from "./SelectDefaultPlanner";
import SelectMajorName from "./SelectMajorName";
import useDefaultPlanners from "./useDefaultPlanners";
import useMajorSelection from "./useMajorSelection";

enum ButtonName {
  Save = "Save",
  CreateNew = "Create New",
  ReplaceCurrent = "Replace Current",
}

export interface MajorSelectionProps {
  onSaved: () => void;
  saveButtonName: string;
  isInPlannerPage?: boolean;
  onSkip?: () => void;
  onCreateNewPlanner?: () => void;
  onReplaceCurrentPlanner?: () => void;
}

export default function MajorSelection({
  saveButtonName,
  onSaved,
  isInPlannerPage,
  onSkip,
  onCreateNewPlanner,
  onReplaceCurrentPlanner,
}: MajorSelectionProps) {
  const [major, setMajor] = useState("");
  const [catalogYear, setCatalogYear] = useState("");
  const [selectedDefaultPlanner, setSelectedDefaultPlanner] = useState("");

  const { data: majors } = useQuery({
    queryKey: ["majors", catalogYear],
    queryFn: async () => {
      return await getAllMajorsByCatalogYear(catalogYear);
    },
    enabled: catalogYear !== "",
  });
  const { data: session } = useSession();

  const majorSelectionIsValid = useMemo(() => {
    const isLoggedIn = session?.user.id !== undefined;
    return major !== "" && catalogYear !== "" && isLoggedIn;
  }, [major, catalogYear, session?.user.id]);

  const [saveButtonClicked, setSaveButtonClicked] = useState<ButtonName>(
    ButtonName.Save,
  );
  const [showSelectionError, setShowSelectionError] = useState(false);
  const { onSaveMajor, loadingSaveMajor, errorSavingMajorData } =
    useMajorSelection(session?.user.id, handleSaveCompleted);

  const {
    userMajorData,
    loadingMajorData,
    errorMajorData,
    setDefaultPlannerId,
    loadingDefaultPlanner,
  } = useContext(DefaultPlannerContext);

  const { majorDefaultPlanners, loading: loadingMajorDefaultPlanners } =
    useDefaultPlanners(catalogYear, major);

  const [replaceAlertOpen, setReplaceAlertOpen] = useState(false);

  useEffect(() => {
    if (userMajorData) {
      console.log(
        `Updating userMajor data ${JSON.stringify(userMajorData, null, 2)}`,
      );
      updateUserMajor(
        userMajorData.name,
        userMajorData.catalogYear,
        userMajorData.defaultPlannerId,
      );
    }
  }, [userMajorData]);

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

  function handleChangeMajor(
    event: React.SyntheticEvent | null,
    newValue: string | null,
  ) {
    if (newValue != null) {
      setMajor(newValue);
    }
  }

  function handleChangeCatalogYear(
    event: React.SyntheticEvent | null,
    newCatalogYear: string | null,
  ) {
    if (typeof newCatalogYear === "string") {
      setCatalogYear(newCatalogYear);
    }
  }

  function handleChangeDefaultPlanner(
    event: React.SyntheticEvent | null,
    plannerId: string | number | null,
  ) {
    if (typeof plannerId === "string") {
      setSelectedDefaultPlanner(plannerId);
    }
  }

  function updateUserMajor(
    name: string,
    catalogYear: string,
    defaultPlannerId: string,
  ) {
    setMajor(name);
    setCatalogYear(catalogYear);
    setSelectedDefaultPlanner(defaultPlannerId);
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
    if (majorSelectionIsValid) {
      setSaveButtonClicked(buttonName);
      setDefaultPlannerId(selectedDefaultPlanner);
      onSaveMajor(major, catalogYear, selectedDefaultPlanner);
      setShowSelectionError(false);
    } else {
      setShowSelectionError(true);
    }
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

  const SelectionErrorAlert = () => (
    <div>
      {showSelectionError && (
        <Alert color="danger" startDecorator={<ReportIcon />}>
          You must select a major and catalog year, and be logged into your UCSC
          email to save your major.
        </Alert>
      )}
    </div>
  );

  const LoadingMajorDataErrorAlert = () => (
    <div>
      {errorMajorData && (
        <Alert color="danger" startDecorator={<ReportIcon />}>
          Error loading major data. Please log out and try again.
        </Alert>
      )}
    </div>
  );

  const SavingMajorDataErrorAlert = () => (
    <div>
      {errorSavingMajorData && (
        <Alert color="danger" startDecorator={<ReportIcon />}>
          Error saving major data. Please log out and try again.
        </Alert>
      )}
    </div>
  );

  return (
    <div className="grid place-items-center my-3 justify-center h-auto w-[66vw] mx-auto overflow-auto">
      <div className="space-y-4 w-full">
        <SelectionErrorAlert />
        <LoadingMajorDataErrorAlert />
        <SavingMajorDataErrorAlert />
        <ConfirmAlert
          open={replaceAlertOpen}
          onClose={() => setReplaceAlertOpen(false)}
          onConfirm={handleConfirmReplaceCurrent}
          dialogText="Are you sure you want to replace your current planner?"
        />
        <div className="grid grid-cols-4 gap-2">
          <div className="col-span-2">
            <SelectCatalogYear
              catalogYear={catalogYear}
              years={years}
              onChange={handleChangeCatalogYear}
            />
          </div>
          <div className="col-span-2">
            <SelectMajorName
              selectedMajor={major}
              majors={majors}
              onChange={handleChangeMajor}
            />
          </div>
        </div>
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
          {loadingSaveMajor ? (
            <CircularProgress variant="plain" color="primary" />
          ) : (
            <SaveButtons
              saveButtonName={saveButtonName}
              isInPlannerPage={isInPlannerPage}
              onSkip={onSkip}
              onClickSave={handleClickSave}
              onClickReplaceCurrent={handleClickReplaceCurrent}
              onClickCreateNew={handleClickCreateNew}
              majorSelectionIsValid={majorSelectionIsValid}
            />
          )}
        </div>
      </div>
    </div>
  );
}

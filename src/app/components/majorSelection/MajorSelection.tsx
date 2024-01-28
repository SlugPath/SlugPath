import { useLoadPlanner } from "@/app/components/planners/useLoad";
import { DefaultPlannerContext } from "@/app/contexts/DefaultPlannerProvider";
import { ModalsProvider } from "@/app/contexts/ModalsProvider";
import { PlannerProvider } from "@/app/contexts/PlannerProvider";
import { GET_ALL_MAJORS } from "@/graphql/queries";
import { years } from "@/lib/defaultPlanners";
import { emptyPlanner } from "@/lib/plannerUtils";
import { useLazyQuery } from "@apollo/client";
import ReportIcon from "@mui/icons-material/Report";
import { Button, CircularProgress } from "@mui/joy";
import { Alert } from "@mui/joy";
import { useSession } from "next-auth/react";
import { useCallback, useContext, useEffect, useState } from "react";

import ConfirmAlert from "../modals/ConfirmAlert";
import CourseInfoModal from "../modals/courseInfoModal/CourseInfoModal";
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
  onUserMajorAlreadyExists?: () => void;
  onSkip?: () => void;
  onCreateNewPlanner?: () => void;
  onReplaceCurrentPlanner?: () => void;
}

export default function MajorSelection({
  saveButtonName,
  onSaved,
  isInPlannerPage,
  onUserMajorAlreadyExists,
  onSkip,
  onCreateNewPlanner,
  onReplaceCurrentPlanner,
}: MajorSelectionProps) {
  const [major, setMajor] = useState("");
  const [catalogYear, setCatalogYear] = useState("");
  const [selectedDefaultPlanner, setSelectedDefaultPlanner] = useState("");
  const [majors, setMajors] = useState<string[]>([]);
  const [majorSelectionIsValid, setMajorSelectionIsValid] = useState(false);
  const [saveButtonClicked, setSaveButtonClicked] = useState<ButtonName>(
    ButtonName.Save,
  );
  const [showSelectionError, setShowSelectionError] = useState(false);
  const { data: session } = useSession();
  const [lazyGetAllMajors] = useLazyQuery(GET_ALL_MAJORS);
  const getAllMajors = useCallback(lazyGetAllMajors, [lazyGetAllMajors]);
  const {
    onSaveMajor,
    userMajorData,
    loadingSaveMajor,
    loadingMajorData,
    errorLoadingMajorData,
    errorSavingMajorData,
  } = useMajorSelection(session?.user.id, handleSaveCompleted);
  const { majorDefaultPlanners, loading: loadingMajorDefaultPlanners } =
    useDefaultPlanners(catalogYear, major);
  const [plannerData, , { loading: loadingPlannerData }] = useLoadPlanner({
    userId: undefined,
    plannerId: selectedDefaultPlanner,
    defaultPlanner: emptyPlanner(),
  });
  const { setDefaultPlanner } = useContext(DefaultPlannerContext);
  const [replaceAlertOpen, setReplaceAlertOpen] = useState(false);

  useEffect(() => {
    function isMajorSelectionValid() {
      const isLoggedIn = session?.user.id !== undefined;
      return major !== "" && catalogYear !== "" && isLoggedIn;
    }

    setMajorSelectionIsValid(isMajorSelectionValid());
  }, [major, catalogYear, selectedDefaultPlanner, session?.user.id]);

  useEffect(() => {
    getAllMajors({
      variables: {
        catalogYear,
      },
      onCompleted: (data) => {
        setMajors(data.getAllMajors);
      },
    });
  }, [catalogYear, getAllMajors]);

  useEffect(() => {
    function majorDataAlreadyChosen() {
      return (
        userMajorData !== null &&
        userMajorData.name.length > 0 &&
        userMajorData.catalogYear.length > 0
      );
    }

    if (userMajorData) {
      updateMajorUseState(
        userMajorData.name,
        userMajorData.catalogYear,
        userMajorData.defaultPlannerId,
      );

      if (majorDataAlreadyChosen() && onUserMajorAlreadyExists) {
        onUserMajorAlreadyExists();
      }
    }
  }, [onUserMajorAlreadyExists, userMajorData]);

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

  function updateMajorUseState(
    name: string,
    catalogYear: string,
    defaultPlannerId: string,
  ) {
    setMajor(name);
    setCatalogYear(catalogYear);
    setSelectedDefaultPlanner(defaultPlannerId);
  }

  function handleSaveCompleted() {
    setDefaultPlanner(plannerData);

    switch (saveButtonClicked) {
      case ButtonName.Save:
        onSaved();
        break;
      case ButtonName.CreateNew:
        if (onCreateNewPlanner && !loadingPlannerData) {
          onCreateNewPlanner();
        }
        break;
      case ButtonName.ReplaceCurrent:
        if (onReplaceCurrentPlanner && !loadingPlannerData) {
          onReplaceCurrentPlanner();
        }
        break;
    }
  }

  function handleSave(buttonName: ButtonName) {
    if (majorSelectionIsValid) {
      setSaveButtonClicked(buttonName);
      onSaveMajor(major, catalogYear, selectedDefaultPlanner);
      setShowSelectionError(false);
    } else {
      setShowSelectionError(true);
    }
  }

  function handleConfirmReplaceCurrent() {
    handleSave(ButtonName.ReplaceCurrent);
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
      {errorLoadingMajorData && (
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
            major={major}
            majors={majors}
            onChange={handleChangeMajor}
          />
        </div>
      </div>
      <div>
        <PlannerProvider plannerId={""} title={""} order={0}>
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
        </PlannerProvider>
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
  );
}

function SaveButtons({
  saveButtonName,
  isInPlannerPage,
  onSkip,
  onClickSave,
  onClickReplaceCurrent,
  onClickCreateNew,
  majorSelectionIsValid,
}: {
  saveButtonName: string;
  isInPlannerPage?: boolean;
  onSkip?: () => void;
  onClickSave: () => void;
  onClickReplaceCurrent: () => void;
  onClickCreateNew: () => void;
  majorSelectionIsValid: boolean;
}) {
  return (
    <div>
      {onSkip && (
        <Button onClick={onSkip} variant="plain">
          Skip
        </Button>
      )}
      <div>
        <Button onClick={onClickSave}>{saveButtonName}</Button>
        {isInPlannerPage && (
          <>
            <Button
              disabled={!majorSelectionIsValid}
              color="warning"
              onClick={onClickReplaceCurrent}
            >
              Replace Current
            </Button>
            <Button
              disabled={!majorSelectionIsValid}
              onClick={onClickCreateNew}
            >
              Create New
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

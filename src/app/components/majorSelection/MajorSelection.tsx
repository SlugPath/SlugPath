import { Button, CircularProgress } from "@mui/joy";
import { useCallback, useEffect, useState } from "react";
import useMajorSelection from "../../hooks/useMajorSelection";
import { useSession } from "next-auth/react";
import { years } from "@/lib/defaultPlanners";
import { useLazyQuery } from "@apollo/client";
import { GET_ALL_MAJORS } from "@/graphql/queries";
import useDefaultPlanners from "../../hooks/useDefaultPlanners";
import { Alert } from "@mui/joy";
import ReportIcon from "@mui/icons-material/Report";
import SelectMajorName from "./SelectMajorName";
import SelectCatalogYear from "./SelectCatalogYear";
import SelectDefaultPlanner from "./SelectDefaultPlanner";

export default function MajorSelection({
  saveButtonName,
  handleSave,
}: {
  handleSave: any;
  saveButtonName: string;
}) {
  const [major, setMajor] = useState("");
  const [catalogYear, setCatalogYear] = useState("");
  const [selectedDefaultPlanner, setSelectedDefaultPlanner] = useState("");
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(false);
  const [majors, setMajors] = useState<string[]>([]);
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
    if (userMajorData) {
      updateMajorUseState(
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
        const plannerIds = majorDefaultPlanners.map(
          (planner: any) => planner.id,
        );
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
    newValue: string | null,
  ) {
    if (newValue != null) {
      setCatalogYear(newValue);
    }
  }

  function handleChangeDefaultPlanner(
    event: React.SyntheticEvent | null,
    plannerId: string | null,
  ) {
    if (plannerId != null) {
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
    handleSave();
  }

  function handleClickSave() {
    if (majorSelectionIsValid()) {
      setSaveButtonDisabled(true);
      onSaveMajor(major, catalogYear, selectedDefaultPlanner);
      setShowSelectionError(false);
    } else {
      setShowSelectionError(true);
    }
  }

  function majorSelectionIsValid() {
    const isLoggedIn = session?.user.id !== undefined;
    return major !== "" && catalogYear !== "" && isLoggedIn;
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
    <div className="space-y-4">
      <SelectionErrorAlert />
      <LoadingMajorDataErrorAlert />
      <SavingMajorDataErrorAlert />
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
        <SelectDefaultPlanner
          selectedDefaultPlanner={selectedDefaultPlanner}
          onChange={handleChangeDefaultPlanner}
          majorDefaultPlanners={majorDefaultPlanners}
          loadingMajorDefaultPlanners={loadingMajorDefaultPlanners}
        />
      </div>
      <div className="flex justify-end w-full">
        {saveButtonDisabled || loadingSaveMajor ? (
          <CircularProgress variant="plain" color="primary" />
        ) : (
          <Button onClick={handleClickSave}>{saveButtonName}</Button>
        )}
      </div>
    </div>
  );
}

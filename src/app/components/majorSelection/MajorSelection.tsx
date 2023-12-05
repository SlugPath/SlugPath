import {
  Button,
  Option,
  Select,
  Tab,
  Tabs,
  TabList,
  Tooltip,
  Typography,
  CircularProgress,
  List,
  ListItem,
} from "@mui/joy";
import Info from "@mui/icons-material/Info";
import { useCallback, useEffect, useState } from "react";
import useMajorSelection from "../../hooks/useMajorSelection";
import { useSession } from "next-auth/react";
import { years } from "@/lib/defaultPlanners";
import { useLazyQuery } from "@apollo/client";
import { GET_ALL_MAJORS } from "@/graphql/queries";
import useDefaultPlanners from "../../hooks/useDefaultPlanners";
import MiniPlanner from "./miniPlanner/MiniPlanner";
import { EMPTY_PLANNER } from "@/lib/plannerUtils";

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
  const { data: session } = useSession();
  const [lazyGetAllMajors] = useLazyQuery(GET_ALL_MAJORS);
  const getAllMajors = useCallback(lazyGetAllMajors, [lazyGetAllMajors]);
  const { onSaveMajor, userMajorData, loadingSaveMajor, loadingMajorData } =
    useMajorSelection(session?.user.id, handleSaveCompleted);
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
    setSaveButtonDisabled(true);
    onSaveMajor(major, catalogYear, selectedDefaultPlanner);
  }

  if (loadingMajorData) {
    return <CircularProgress variant="plain" color="primary" />;
  }

  return (
    <div className="space-y-4">
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
        <Button
          disabled={saveButtonDisabled || loadingSaveMajor}
          onClick={handleClickSave}
        >
          {saveButtonName}
        </Button>
      </div>
    </div>
  );
}

function SelectMajorName({
  major,
  majors,
  onChange,
}: {
  major: string;
  majors: string[];
  onChange: any;
}) {
  return (
    <>
      <Typography level="body-lg">Select your major</Typography>
      <Select
        value={major}
        placeholder="Choose one…"
        variant="soft"
        onChange={onChange}
        disabled={majors.length == 0}
      >
        {majors.map((major, index) => (
          <Option key={index} value={major}>
            {major}
          </Option>
        ))}
      </Select>
    </>
  );
}

function SelectCatalogYear({
  catalogYear,
  years,
  onChange,
}: {
  catalogYear: string;
  years: string[];
  onChange: any;
}) {
  return (
    <>
      <Typography level="body-lg">Select your catalog year</Typography>
      <Select
        value={catalogYear}
        placeholder="Choose one…"
        variant="soft"
        onChange={onChange}
      >
        {years.map((year, index) => (
          <Option key={index} value={year}>
            {year}
          </Option>
        ))}
      </Select>
    </>
  );
}

function SelectDefaultPlanner({
  selectedDefaultPlanner,
  onChange,
  majorDefaultPlanners,
  loadingMajorDefaultPlanners,
}: {
  selectedDefaultPlanner: string;
  onChange: any;
  majorDefaultPlanners: any;
  loadingMajorDefaultPlanners: boolean;
}) {
  const defaultPlanners: { id: string; title: string }[] =
    majorDefaultPlanners === undefined ? [] : majorDefaultPlanners;

  return (
    <>
      <div className="flex flex-row space-x-2">
        <Typography level="body-lg">Select a default planner</Typography>
        <Tooltip title="The default planner you select will be auto filled into any new planners you create">
          <Info sx={{ color: "gray" }} />
        </Tooltip>
      </div>
      <div className="space-y-2">
        <Tabs
          defaultValue={selectedDefaultPlanner}
          value={selectedDefaultPlanner}
          variant="soft"
          onChange={onChange}
        >
          <TabList>
            {defaultPlanners &&
              defaultPlanners.map((planner: any, index: number) => (
                <Tab key={index} value={planner.id}>
                  {planner.title}
                </Tab>
              ))}
            <Tab value={-1}>None</Tab>
          </TabList>
        </Tabs>
        {loadingMajorDefaultPlanners && (
          <MiniPlanner
            plannerId={EMPTY_PLANNER}
            title={"Loading..."}
            order={0}
            active={true}
          />
        )}
        {!loadingMajorDefaultPlanners && (
          <>
            <List>
              {defaultPlanners.map((defaultPlanner, index: number) => {
                const id = defaultPlanner.id;
                const title = defaultPlanner.title;
                const plannerIsSelected = selectedDefaultPlanner == id;
                return (
                  <ListItem
                    sx={{ display: plannerIsSelected ? "block" : "none" }}
                    key={index}
                  >
                    <MiniPlanner
                      plannerId={id}
                      title={title}
                      order={index}
                      active={plannerIsSelected}
                    />
                  </ListItem>
                );
              })}
            </List>
          </>
        )}
      </div>
    </>
  );
}

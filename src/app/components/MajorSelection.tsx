import {
  Select,
  Option,
  Typography,
  Tab,
  Tabs,
  TabList,
  Card,
  Tooltip,
  Button,
  CircularProgress,
} from "@mui/joy";
import Info from "@mui/icons-material/Info";
import { useCallback, useEffect, useState } from "react";
import useMajorSelection from "../hooks/useMajorSelection";
import { useSession } from "next-auth/react";
import { years } from "@/lib/defaultPlanners";
import { initialPlanner, quartersPerYear } from "@/lib/plannerUtils";
import { useLazyQuery } from "@apollo/client";
import { GET_ALL_MAJORS } from "@/graphql/queries";

export default function MajorSelection({
  saveButtonName,
  handleSave,
}: {
  handleSave: any;
  saveButtonName: string;
}) {
  const [major, setMajor] = useState("");
  const [catalogYear, setCatalogYear] = useState("");
  const [defaultPlanner, setDefaultPlanner] = useState(0);
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(false);
  const [majors, setMajors] = useState<string[]>([]);
  const { data: session } = useSession();
  const [lazyGetAllMajors] = useLazyQuery(GET_ALL_MAJORS);
  const getAllMajors = useCallback(lazyGetAllMajors, [lazyGetAllMajors]);
  const { onSaveMajor, userMajorData, loadingSaveMajor, loading } =
    useMajorSelection(session?.user.id, handleSaveCompleted);

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
    event: any,
    index: number | string | null,
  ) {
    if (typeof index === "number") {
      // TODO: get id here instead of index
      setDefaultPlanner(index);
    }
  }

  function updateMajorUseState(
    name: string,
    catalogYear: string,
    defaultPlannerId: number,
  ) {
    setMajor(name);
    setCatalogYear(catalogYear);
    setDefaultPlanner(defaultPlannerId);
  }

  function handleSaveCompleted() {
    handleSave();
  }

  function handleClickSave() {
    setSaveButtonDisabled(true);
    onSaveMajor(major, catalogYear, defaultPlanner.toString());
  }

  if (loading) {
    return <CircularProgress variant="plain" color="primary" />;
  }

  return (
    <div className="space-y-4">
      <div>
        <SelectCatalogYear
          catalogYear={catalogYear}
          years={years}
          onChange={handleChangeCatalogYear}
        />
      </div>
      <div>
        <SelectMajorName
          major={major}
          majors={majors}
          onChange={handleChangeMajor}
        />
      </div>
      <div>
        <SelectDefaultPlanner
          defaultPlanner={defaultPlanner}
          onChange={handleChangeDefaultPlanner}
        />
      </div>
      <div className="flex justify-end w-full">
        <Button
          disabled={saveButtonDisabled || loadingSaveMajor}
          variant="plain"
          color="primary"
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
  defaultPlanner,
  onChange,
}: {
  defaultPlanner: number;
  onChange: any;
}) {
  return (
    <>
      <div className="flex flex-row space-x-2">
        <Typography level="body-lg">Select a default planner</Typography>
        <Tooltip title="The default planner you select will be auto filled into any new planners you create">
          <Info sx={{ color: "gray" }} />
        </Tooltip>
      </div>
      <div className="space-y-2">
        <Tabs value={defaultPlanner} variant="soft" onChange={onChange}>
          <TabList>
            <Tab>4 Year Plan</Tab>
            <Tab>4 Year Plan</Tab>
            <Tab>2 Year Plan</Tab>
            <Tab>None</Tab>
          </TabList>
        </Tabs>
        <MiniPlanner />
      </div>
    </>
  );
}

function MiniPlanner() {
  const planner = initialPlanner();

  return (
    <Card>
      {Array.from({ length: quartersPerYear }, (_, index) => index).map((i) => {
        const slice_val = quartersPerYear * i;
        const quarters = planner.quarters.slice(
          slice_val,
          slice_val + quartersPerYear,
        );
        return (
          <div key={i} className="flex flex-row space-x-2">
            {quarters.map((quarter, index) => {
              // const courses = findCoursesInQuarter(planner, quarter.id);
              return (
                <div key={index}>
                  <Card>{quarter.title}</Card>
                </div>
              );
            })}
          </div>
        );
      })}
    </Card>
  );
}

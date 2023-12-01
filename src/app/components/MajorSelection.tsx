/* eslint-disable @typescript-eslint/no-unused-vars */
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
} from "@mui/joy";
import Info from "@mui/icons-material/Info";
import { useEffect, useState } from "react";
import useMajorSelection from "../hooks/useMajorSelection";
import { useSession } from "next-auth/react";
import { majors, years } from "@/lib/defaultPlanners";

export default function MajorSelection() {
  const { data: session, status } = useSession();
  const { onSaveMajor, majorData, loading } = useMajorSelection(
    session?.user.id,
  );
  const [major, setMajor] = useState("");
  const [catalogYear, setCatalogYear] = useState("");
  const [defaultPlanner, setDefaultPlanner] = useState("");

  useEffect(() => {
    if (majorData) {
      const major = majorData.getUserMajor;
      setMajor(major.name);
      setCatalogYear(major.catalogYear);
      setDefaultPlanner(major.defaultPlanners[0].id);
    }
  }, [majorData]);

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
      setDefaultPlanner(index.toString());
    }
  }

  function handleClickNext() {
    onSaveMajor(major, catalogYear, defaultPlanner);
  }

  return (
    <div className="space-y-4">
      <div>
        <SelectMajorName
          major={major}
          majors={majors}
          onChange={handleChangeMajor}
        />
      </div>
      <div>
        <SelectCatalogYear
          catalogYear={catalogYear}
          years={years}
          onChange={handleChangeCatalogYear}
        />
      </div>
      <div>
        <SelectDefaultPlanner
          defaultPlanner={defaultPlanner}
          onChange={handleChangeDefaultPlanner}
        />
      </div>
      <div className="flex justify-end w-full">
        <Button variant="solid" color="primary" onClick={handleClickNext}>
          Next
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
  defaultPlanner: string;
  onChange: any;
}) {
  return (
    <>
      <div className="flex flex-row space-x-2">
        <Typography level="body-lg">Select a default planner</Typography>
        <Tooltip title="The default planner you select will be auto filled into your course planner">
          <Info sx={{ color: "gray" }} />
        </Tooltip>
      </div>
      <Tabs value={defaultPlanner} variant="soft" onChange={onChange}>
        <TabList>
          <Tab>4 Year Plan</Tab>
          <Tab>4 Year Plan</Tab>
          <Tab>2 Year Plan</Tab>
          <Tab>None</Tab>
        </TabList>
      </Tabs>
      <Card className="h-64 my-2" variant="soft">
        Planner
      </Card>
    </>
  );
}

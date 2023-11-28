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
import { useState } from "react";
import useMajorSelection from "../hooks/useMajorSelection";
import { useSession } from "next-auth/react";

const majors = [
  "CSE BS",
  "CSE BA",
  "AMS BS",
  "AMS BA",
  "BIO BS",
  "BIO BA",
  "CHEM BS",
  "CHEM BA",
  "ECON BS",
  "ECON BA",
  "MATH BS",
  "MATH BA",
  "PHYS BS",
  "PHYS BA",
  "PSY BS",
  "PSY BA",
  "STA BS",
  "STA BA",
];

const years = [
  "2016-2017",
  "2018-2019",
  "2019-2020",
  "2020-2021",
  "2021-2022",
  "2022-2023",
  "2023-2024",
  "2024-2025",
];

export default function MajorSelection() {
  const [major, setMajor] = useState("");
  const [catalogYear, setCatalogYear] = useState("");
  const [defaultPlanner, setDefaultPlanner] = useState(0);
  const { data: session, status } = useSession();
  // const { onSaveMajor, majorData } = useMajorSelection(session?.user.id);
  // console.log(majorData)

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
      setDefaultPlanner(index);
    }
  }

  return (
    <div className="space-y-4">
      {/* <div>Major: {majorData.name}</div> */}
      <div>Status: {status}</div>
      <div>
        <SelectMajorName majors={majors} onChange={handleChangeMajor} />
      </div>
      <div>
        <SelectCatalogYear years={years} onChange={handleChangeCatalogYear} />
      </div>
      <div>
        <SelectDefaultPlanner
          defaultPlanner={defaultPlanner}
          onChange={handleChangeDefaultPlanner}
        />
      </div>
      <div className="flex justify-end w-full">
        <Button
          variant="solid"
          color="primary"
          // onClick={() => onSaveMajor(major, catalogYear, defaultPlanner.toString())}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

function SelectMajorName({
  majors,
  onChange,
}: {
  majors: string[];
  onChange: any;
}) {
  return (
    <>
      <Typography level="body-lg">Select your major</Typography>
      <Select placeholder="Choose one…" variant="soft" onChange={onChange}>
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
  years,
  onChange,
}: {
  years: string[];
  onChange: any;
}) {
  return (
    <>
      <Typography level="body-lg">Select your catalog year</Typography>
      <Select placeholder="Choose one…" variant="soft" onChange={onChange}>
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

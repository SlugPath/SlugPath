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
  List,
  ListItem,
} from "@mui/joy";
import Info from "@mui/icons-material/Info";
import { useCallback, useEffect, useState } from "react";
import useMajorSelection from "../hooks/useMajorSelection";
import { useSession } from "next-auth/react";
import { years } from "@/lib/defaultPlanners";
import { initialPlanner, quartersPerYear } from "@/lib/plannerUtils";
import { useLazyQuery } from "@apollo/client";
import { GET_ALL_MAJORS } from "@/graphql/queries";
import useDefaultPlanners from "../hooks/useDefaultPlanners";
import usePlanner from "../hooks/usePlanner";
import { PlannerData, findCoursesInQuarter } from "../types/PlannerData";
import { StoredCourse } from "../types/Course";
import { Quarter } from "../types/Quarter";

export default function MajorSelection({
  saveButtonName,
  handleSave,
}: {
  handleSave: any;
  saveButtonName: string;
}) {
  const [major, setMajor] = useState("");
  const [catalogYear, setCatalogYear] = useState("");
  const [defaultPlannerIndex, setDefaultPlannerIndex] = useState(0);
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

  // set default planner index to 0 when majorDefaultPlanners changes
  // so that default planner tabs work correctly
  useEffect(() => {
    setDefaultPlannerIndex(0);
  }, [majorDefaultPlanners]);

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
      setDefaultPlannerIndex(index);
    }
  }

  function updateMajorUseState(
    name: string,
    catalogYear: string,
    defaultPlannerId: number,
  ) {
    setMajor(name);
    setCatalogYear(catalogYear);
    setDefaultPlannerIndex(defaultPlannerId);
  }

  function handleSaveCompleted() {
    handleSave();
  }

  function handleClickSave() {
    setSaveButtonDisabled(true);
    onSaveMajor(major, catalogYear, defaultPlannerIndex.toString());
  }

  if (loadingMajorData) {
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
          defaultPlannerIndex={defaultPlannerIndex}
          onChange={handleChangeDefaultPlanner}
          majorDefaultPlanners={majorDefaultPlanners}
          loadingMajorDefaultPlanners={loadingMajorDefaultPlanners}
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
  defaultPlannerIndex,
  onChange,
  majorDefaultPlanners,
  loadingMajorDefaultPlanners,
}: {
  defaultPlannerIndex: number;
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
          defaultValue={0}
          value={defaultPlannerIndex}
          variant="soft"
          onChange={onChange}
        >
          <TabList>
            {defaultPlanners &&
              defaultPlanners.map((planner: any, index: number) => (
                <Tab key={index} value={index}>
                  {planner.title}
                </Tab>
              ))}
            <Tab value={-1}>None</Tab>
          </TabList>
        </Tabs>
        {loadingMajorDefaultPlanners && (
          // <div className="flex justify-center">
          //   <CircularProgress variant="plain" color="primary" />
          // </div>
          <MiniPlanner
            plannerId={"wow random stuff"}
            title={"Loading..."}
            order={0}
            active={true}
          />
        )}
        {!loadingMajorDefaultPlanners && (
          <>
            <List>
              {Object.keys(defaultPlanners).map((id, index: number) => {
                const plannerIsSelected = defaultPlannerIndex == index;
                return (
                  <ListItem
                    sx={{ display: plannerIsSelected ? "block" : "none" }}
                    key={index}
                  >
                    <MiniPlanner
                      plannerId={defaultPlanners[index].id}
                      title={defaultPlanners[index].title}
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

function MiniPlanner({
  plannerId,
  title,
  order,
  active,
}: {
  plannerId: string;
  title: string;
  order: number;
  active?: boolean;
}) {
  const { courseState } = usePlanner({
    userId: undefined,
    plannerId: plannerId,
    title,
    order,
  });

  if (!active) {
    return <></>;
  }

  return (
    <>
      <Card>
        <MiniQuarters
          courseState={courseState ? courseState : initialPlanner()}
        />
      </Card>
    </>
  );
}

function MiniQuarters({ courseState }: { courseState: PlannerData }) {
  return (
    <>
      {Array.from({ length: quartersPerYear }, (_, index) => index).map((i) => {
        const slice_val = quartersPerYear * i;
        const quarters = courseState.quarters.slice(
          slice_val,
          slice_val + quartersPerYear,
        );
        return (
          <div key={i} className="flex flex-row space-x-2">
            {quarters.map((quarter: Quarter, index: number) => {
              const courses: StoredCourse[] = findCoursesInQuarter(
                courseState,
                quarter.id,
              );
              return (
                <MiniQuarterCard
                  key={index}
                  quarter={quarter}
                  courses={courses}
                />
              );
            })}
          </div>
        );
      })}
    </>
  );
}

function MiniQuarterCard({
  quarter,
  courses,
}: {
  quarter: Quarter;
  courses: StoredCourse[];
}) {
  function courseTitle(course: StoredCourse) {
    if (course.departmentCode && course.number) {
      return `${course.departmentCode} ${course.number}`;
    }
    return course.title;
  }

  return (
    <Card size="sm" className="w-full">
      {quarter.title}
      {courses.map((course, index) => (
        <div key={index} className="pl-4">
          <li>{courseTitle(course)}</li>
        </div>
      ))}
    </Card>
  );
}

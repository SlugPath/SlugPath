import {
  Tab,
  Tabs,
  TabList,
  Tooltip,
  Typography,
  List,
  ListItem,
  Card,
} from "@mui/joy";
import Info from "@mui/icons-material/Info";
import MiniPlanner from "./miniPlanner/MiniPlanner";
import { EMPTY_PLANNER } from "@/lib/plannerUtils";
import { SyntheticEvent } from "react";

export default function SelectDefaultPlanner({
  selectedDefaultPlanner,
  onChange,
  majorDefaultPlanners,
  loadingMajorDefaultPlanners,
  addPlannerCardContainer,
}: {
  selectedDefaultPlanner: string;
  onChange: (
    event: SyntheticEvent<Element, Event> | null,
    value: string | number | null,
  ) => void;
  majorDefaultPlanners: any;
  loadingMajorDefaultPlanners: boolean;
  addPlannerCardContainer?: boolean;
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
          </TabList>
        </Tabs>
        {loadingMajorDefaultPlanners ? (
          <MiniPlanner plannerId={EMPTY_PLANNER} active={true} />
        ) : (
          <>
            <List>
              {defaultPlanners.map((defaultPlanner, index: number) => {
                const id = defaultPlanner.id;
                const plannerIsSelected = selectedDefaultPlanner == id;
                return (
                  <ListItem
                    sx={{ display: plannerIsSelected ? "block" : "none" }}
                    key={index}
                  >
                    {addPlannerCardContainer ? (
                      <Card variant="soft">
                        <MiniPlanner
                          plannerId={id}
                          active={plannerIsSelected}
                        />
                      </Card>
                    ) : (
                      <MiniPlanner plannerId={id} active={plannerIsSelected} />
                    )}
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

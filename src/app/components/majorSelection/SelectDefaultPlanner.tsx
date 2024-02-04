import { EMPTY_PLANNER } from "@/lib/plannerUtils";
import { PlannerTitle } from "@customTypes/Planner";
import Info from "@mui/icons-material/Info";
import {
  Card,
  List,
  ListItem,
  Tab,
  TabList,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/joy";
import { SyntheticEvent } from "react";

import MiniPlanner from "./miniPlanner/MiniPlanner";

export interface SelectDefaultPlannerProps {
  selectedDefaultPlanner: string;
  onChange: (
    event: SyntheticEvent<Element, Event> | null,
    value: string | number | null,
  ) => void;
  majorDefaultPlanners: PlannerTitle[] | undefined;
  loadingMajorDefaultPlanners: boolean;
  addPlannerCardContainer?: boolean;
}

export default function SelectDefaultPlanner({
  selectedDefaultPlanner,
  onChange,
  majorDefaultPlanners,
  loadingMajorDefaultPlanners,
  addPlannerCardContainer,
}: SelectDefaultPlannerProps) {
  const defaultPlanners: PlannerTitle[] = majorDefaultPlanners ?? [];

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
              defaultPlanners.map((planner, index) => (
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
                    sx={{
                      display: plannerIsSelected ? "block" : "none",
                    }}
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

import { EMPTY_PLANNER } from "@/lib/plannerUtils";
import { PlannerTitle } from "@customTypes/Planner";
import Info from "@mui/icons-material/Info";
import {
  List,
  ListItem,
  Tab,
  TabList,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/joy";
import { SyntheticEvent } from "react";

import MiniPlanner from "../majorSelection/miniPlanner/MiniPlanner";

export interface SelectDefaultPlannerProps {
  onChange: (
    event: SyntheticEvent<Element, Event> | null,
    value: string | number | null,
  ) => void;
  loadingMajorDefaultPlanners: boolean;
  majorDefaultPlanners?: PlannerTitle[];
  selectedDefaultPlanner?: string;
}

export default function SelectDefaultPlanner({
  selectedDefaultPlanner,
  onChange,
  majorDefaultPlanners,
  loadingMajorDefaultPlanners,
}: SelectDefaultPlannerProps) {
  const defaultPlanners: PlannerTitle[] = majorDefaultPlanners ?? [];

  return (
    <>
      <div className="flex flex-row space-x-2 items-center">
        <Typography level="body-lg">Default Planner</Typography>
        <Tooltip title="The default planner you select will be used to auto-fill classes into your planner">
          <Info sx={{ color: "gray" }} />
        </Tooltip>
      </div>
      <div className="space-y-2">
        <Tabs value={selectedDefaultPlanner} variant="soft" onChange={onChange}>
          <TabList>
            {defaultPlanners?.map((planner, index) => (
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
                    <MiniPlanner plannerId={id} active={plannerIsSelected} />
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

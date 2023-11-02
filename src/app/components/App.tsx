import { List, ListItem } from "@mui/joy";
import CoursePlanner from "./CoursePlanner";
import TabList from "./TabList";
import { usePlanner } from "../hooks/usePlanner";

export default function App() {
  const {
    planners,
    handleRemovePlanner,
    handleAddPlanner,
    handleSwitchPlanners,
    handleChangePlannerName,
  } = usePlanner();

  return (
    <div>
      <TabList
        planners={planners}
        onRemovePlanner={handleRemovePlanner}
        onAddPlanner={handleAddPlanner}
        onSwitchPlanners={handleSwitchPlanners}
        onChangePlannerName={handleChangePlannerName}
      />
      <List>
        {Object.entries(planners).map(([id, [, isActive]]) => (
          <ListItem sx={{ display: isActive ? "block" : "none" }} key={id}>
            <CoursePlanner id={id} isActive={isActive} />
          </ListItem>
        ))}
      </List>
    </div>
  );
}

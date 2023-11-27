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

export default function MajorSelection() {
  return (
    <div className="space-y-4">
      <div>
        <Typography level="body-lg">Select your major</Typography>
        <Select placeholder="Choose one…" variant="soft">
          <Option value="CSE BS">CSE BS</Option>
          <Option value="CSE BA">CSE BA</Option>
          <Option value="AMS BS">AMS BS</Option>
          <Option value="AMS BA">AMS BA</Option>
        </Select>
      </div>
      <div>
        <Typography level="body-lg">Select your catalog year</Typography>
        <Select placeholder="Choose one…" variant="soft">
          <Option value="2021">2021</Option>
          <Option value="2022">2022</Option>
          <Option value="2023">2023</Option>
          <Option value="2024">2024</Option>
        </Select>
      </div>
      <div>
        <div className="flex flex-row space-x-2">
          <Typography level="body-lg">Select a default planner</Typography>
          <Tooltip title="The default planner you select will be auto filled into your course planner">
            <Info sx={{ color: "gray" }} />
          </Tooltip>
        </div>
        <Tabs variant="soft">
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
      </div>
      <div className="flex justify-end w-full">
        <Button variant="solid" color="primary">
          Next
        </Button>
      </div>
    </div>
  );
}

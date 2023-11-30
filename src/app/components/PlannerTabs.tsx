import { IconButton, Input, Tabs, TabList } from "@mui/joy";
import Tab, { tabClasses } from "@mui/joy/Tab";
import { Add } from "@mui/icons-material";
import { useContext, useState } from "react";
import PlannerDeleteAlert, { OpenState } from "./PlannerDeleteAlert";
import TooManyPlannersAlert from "./TooManyPlannersAlert";
import { PlannersContext } from "../contexts/PlannersProvider";
import TitleSnackbar from "./TitleSnackbar";
import CloseIconButton from "./CloseIconButton";

const MAX_PLANNERS = 8;

export default function PlannerTabs() {
  const {
    planners,
    removePlanner,
    switchPlanners,
    changePlannerName,
    addPlanner,
    activePlanner,
  } = useContext(PlannersContext);

  // State-ful variables for managing the editing of planner names
  // and deletion alerts
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [openAlert, setAlert] = useState<OpenState>(["", ""]);
  const [openTooMany, setTooMany] = useState(false);

  /**
   * Event listener that runs when user clicks the add button
   */
  const handleAddPlanner = () => {
    // Check if user has too many planners open
    if (Object.keys(planners).length == MAX_PLANNERS) {
      setTooMany(true);
      return;
    }
    addPlanner();
  };

  /**
   * Callback to delete planner and close the alert modal
   * @param id planner id
   */
  const deletePlanner = (id: string) => {
    setAlert(["", ""]);
    removePlanner(id);
  };

  const handleBlur = (title: string) => {
    title.length > 2 && setIsEditing(null);
  };

  const handleTabChange = (e: any, index: number | string | null) => {
    if (typeof index === "string" && index !== "add-planner-tab") {
      const title = planners[index][0];
      switchPlanners(index, title);
    }
  };

  return (
    <Tabs
      aria-label="tabs"
      defaultValue={0}
      sx={{ bgcolor: "transparent" }}
      onChange={handleTabChange}
      value={activePlanner ? activePlanner.id : null}
    >
      <TabList
        disableUnderline
        sx={{
          p: 0.5,
          gap: 0.5,
          borderRadius: "xl",
          [`& .${tabClasses.root}[aria-selected="true"]`]: {
            bgcolor: "#60A5FA",
          },
          [`& .${tabClasses.root}[aria-selected="false"]`]: {
            bgcolor: "#BFDBFE",
          },
          [`& .${tabClasses.root}:hover`]: {
            bgcolor: "#93C5FD",
          },
        }}
      >
        {/* Start alerts */}
        <PlannerDeleteAlert
          open={openAlert}
          onClose={() => setAlert(["", ""])}
          onDelete={deletePlanner}
        />
        <TooManyPlannersAlert
          open={openTooMany}
          onClose={() => setTooMany(false)}
        />
        {/* End alerts */}
        {Object.entries(planners).map(([id, [title]]) => (
          <Tab
            onDoubleClick={() => setIsEditing(id)}
            key={id}
            disableIndicator
            value={id}
          >
            {/* Editable planner titles */}
            {isEditing === id ? (
              <>
                <TitleSnackbar error={title.length < 2} />
                <Input
                  variant="soft"
                  value={title}
                  autoFocus
                  error={title.length < 2}
                  size="md"
                  sx={{
                    "--Input-focusedInset": "var(--any, )",
                    "--Input-focusedThickness": "0.25rem",
                    "&::before": {
                      transition: "box-shadow .15s ease-in-out",
                    },
                    "&:focus-within": {
                      borderColor: "#86b7fe",
                    },
                    maxWidth: "15ch",
                  }}
                  onChange={(e) => changePlannerName(e, id)}
                  onBlur={() => handleBlur(title)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleBlur(title);
                    }
                  }}
                />
              </>
            ) : (
              <span>{title}</span>
            )}
            <CloseIconButton onClick={() => setAlert([id, title])} />
          </Tab>
        ))}
        {/* Add new planner button */}
        <IconButton
          onClick={() => handleAddPlanner()}
          aria-label="Add"
          size="sm"
          variant="plain"
          color="primary"
        >
          <Add />
        </IconButton>
      </TabList>
    </Tabs>
  );
}

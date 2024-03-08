import { PlannerContext } from "@contexts/PlannerProvider";
import { Label } from "@customTypes/Label";
import { AccordionDetails, Button, Chip, useColorScheme } from "@mui/joy";
import Accordion, { accordionClasses } from "@mui/joy/Accordion";
import AccordionSummary, {
  accordionSummaryClasses,
} from "@mui/joy/AccordionSummary";
import { useContext, useState } from "react";

import LabelsSelectionModal from "../modals/courseInfoModal/LabelSelectionModal";
import CourseLabel from "../planner/quarters/courses/CourseLabel";

export default function LabelLegend() {
  const { mode } = useColorScheme();
  const backgroundColor = mode === "light" ? "#f1f5f9" : "#181a1c";

  const { getAllLabels, updatePlannerLabels } = useContext(PlannerContext);

  const [showLabelSelectionModal, setShowLabelSelectionModal] = useState(false);

  // Handlers
  const handleEditLabels = () => {
    setShowLabelSelectionModal(true);
  };

  const handleUpdateLabels = (labels: Label[]) => {
    //const newLabels = labels.map((label) => label.id);
    //const newCourse: StoredCourse = { ...course, labels: newLabels };
    updatePlannerLabels({
      labels,
    });
    // setDisplayCourse([newCourse, term]);
  };

  return (
    <div>
      {getAllLabels() && (
        <LabelsSelectionModal
          showModal={showLabelSelectionModal}
          setShowModal={setShowLabelSelectionModal}
          labels={getAllLabels()}
          selectedLabels={getAllLabels()}
          onUpdateLabels={handleUpdateLabels}
          showLabelChecks={false}
        />
      )}
      <Accordion
        sx={{
          padding: "0.5rem",
          textAlign: "center",
          backgroundColor,
          borderRadius: 8,

          [`& .${accordionSummaryClasses.root}`]: {
            "& button:hover": {
              background: "transparent",
            },
          },
          [`& .${accordionClasses.root}.${accordionClasses.expanded}`]: {
            borderBottom: "1px solid",
            borderColor: "background.level2",
          },
          '& [aria-expanded="true"]': {
            paddingBottom: "0.5rem",
            boxShadow: (theme) =>
              `inset 0 -1px 0 ${theme.vars.palette.divider}`,
          },
        }}
        defaultExpanded={false}
      >
        <AccordionSummary>Labels</AccordionSummary>
        <AccordionDetails sx={{ borderRadius: "sm", paddingTop: "0.5rem" }}>
          <div
            className="flex flex-wrap items-center gap-2"
            style={{ maxWidth: "300px", maxHeight: "100px", overflowY: "auto" }}
          >
            <Chip style={{ backgroundColor: "#858D9B" }}>
              <div>{"GE"}</div>
            </Chip>
            {getAllLabels().map((label) => (
              <div key={label.id}>
                <CourseLabel
                  label={label}
                  displayText={label.name.length > 0}
                  inMenu
                />
              </div>
            ))}
          </div>
          <Button
            size="sm"
            variant="plain"
            onClick={handleEditLabels}
            sx={{ marginTop: "0.5rem" }}
          >
            Edit Labels
          </Button>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

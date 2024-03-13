import { getColor } from "@/lib/labels";
import { PlannerContext } from "@contexts/PlannerProvider";
import { Label } from "@customTypes/Label";
import { Button, Card, CardContent, Chip, Typography } from "@mui/joy";
import { useContext, useState } from "react";

import EditLabelsModal from "../modals/EditLabelsModal";
import CourseLabel from "../planner/quarters/courses/CourseLabel";

export default function LabelLegend() {
  const { getAllLabels, updatePlannerLabels } = useContext(PlannerContext);

  const [showEditLabelsModal, setShowEditLabelsModal] = useState(false);

  const handleEditLabels = () => {
    setShowEditLabelsModal(true);
  };

  const handleUpdateLabels = (labels: Label[]) => {
    updatePlannerLabels({
      labels,
    });
  };

  return (
    <div>
      {getAllLabels() && showEditLabelsModal && (
        <EditLabelsModal
          showModal={showEditLabelsModal}
          setShowModal={setShowEditLabelsModal}
          labels={getAllLabels()}
          onUpdateLabels={handleUpdateLabels}
        />
      )}
      <Card
        variant="plain"
        sx={{
          padding: "1rem",
          textAlign: "center",
          borderRadius: 8,
        }}
      >
        <Typography level="title-lg" sx={{ marginBottom: "-0.25rem" }}>
          Labels
        </Typography>
        <CardContent>
          <div
            className="flex flex-wrap items-center gap-2"
            style={{ maxWidth: "300px", maxHeight: "100px", overflowY: "auto" }}
          >
            <Chip style={getColor("green")}>
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
        </CardContent>
      </Card>
    </div>
  );
}

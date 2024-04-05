import { lookupColor } from "@/lib/labels";
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
            className="flex flex-wrap gap-1"
            style={{
              maxWidth: "300px",
              maxHeight: "100px",
              overflowY: "auto",
              alignItems: "flex-start",
            }}
          >
            <Chip
              style={lookupColor("green")}
              sx={{ paddingX: "0.5rem", marginX: "0.16rem" }}
            >
              <div>{"GE"}</div>
            </Chip>
            {getAllLabels().map((label, index) => (
              <div
                key={label.id}
                style={{ marginBottom: index !== 0 ? "0.20rem" : 0 }}
              >
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

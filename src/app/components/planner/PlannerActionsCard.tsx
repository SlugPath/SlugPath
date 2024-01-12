import { Button, Card } from "@mui/joy";
import { useContext } from "react";
import { ModalsContext } from "../../contexts/ModalsProvider";
export default function PlannerActions() {
  const {
    setShowExportModal,
    setShowMajorSelectionModal,
    setShowMajorProgressModal,
  } = useContext(ModalsContext);
  return (
    <Card variant="plain" className="flex flex-col gap-1">
      <Button onClick={() => setShowExportModal(true)} variant="plain">
        Export Plan
      </Button>
      <Button onClick={() => setShowMajorSelectionModal(true)} variant="plain">
        Edit Major
      </Button>
      <Button onClick={() => setShowMajorProgressModal(true)} variant="plain">
        Major Progress
      </Button>
    </Card>
  );
}

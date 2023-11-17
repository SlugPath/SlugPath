import { Button } from "@mui/joy";
import { useContext } from "react";
import { ModalsStateContext } from "../contexts/ModalsStateProvider";
export default function PlannerActions() {
  const { setShowExportModal, setShowMajorCompletionModal } =
    useContext(ModalsStateContext);
  return (
    <div className="flex flex-col gap-1">
      <Button onClick={() => setShowExportModal(true)} variant="plain">
        Export Planner PDF
      </Button>
      <Button onClick={() => setShowMajorCompletionModal(true)} variant="plain">
        Major Progress Chart
      </Button>
    </div>
  );
}

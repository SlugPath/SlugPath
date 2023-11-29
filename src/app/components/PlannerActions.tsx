import { Button } from "@mui/joy";
import { useContext } from "react";
import { ModalsContext } from "../contexts/ModalsProvider";
export default function PlannerActions() {
  const { setShowExportModal, setShowMajorSelectionModal } =
    useContext(ModalsContext);
  return (
    <div className="flex flex-col gap-1">
      <Button onClick={() => setShowExportModal(true)} variant="plain">
        Export Planner to PDF
      </Button>
      <Button onClick={() => setShowMajorSelectionModal(true)} variant="plain">
        Edit Major
      </Button>
    </div>
  );
}

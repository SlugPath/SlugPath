import { Button } from "@mui/joy";
import { useContext } from "react";
import { ModalsContext } from "../contexts/ModalsProvider";
export default function PlannerActions() {
  const { setShowExportModal } = useContext(ModalsContext);
  return (
    <div className="flex flex-col gap-1">
      <Button onClick={() => setShowExportModal(true)} variant="plain">
        Export Planner to PDF
      </Button>
    </div>
  );
}

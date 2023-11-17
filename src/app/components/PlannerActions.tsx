import { Button } from "@mui/joy";
import { useContext } from "react";
import { ModalsStateContext } from "../contexts/ModalsStateProvider";
export default function PlannerActions() {
  const { setShowExportModal, setShowMajorCompletionModal } =
    useContext(ModalsStateContext);
  return (
    <div className="flex flex-1 justify-end">
      <Button onClick={() => setShowExportModal(true)} variant="plain">
        Export
      </Button>
      <Button onClick={() => setShowMajorCompletionModal(true)} variant="plain">
        Major Progress
      </Button>
    </div>
  );
}

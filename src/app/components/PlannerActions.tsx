import { Button } from "@mui/joy";
import { useContext } from "react";
import { ModalsContext } from "../contexts/ModalsProvider";
export default function PlannerActions() {
  const { setShowExportModal, setShowMajorCompletionModal } =
    useContext(ModalsContext);
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

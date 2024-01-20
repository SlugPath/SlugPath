import { Button, Card } from "@mui/joy";
import { useContext } from "react";
import { ModalsContext } from "../../contexts/ModalsProvider";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import EditIcon from "@mui/icons-material/Edit";

export default function PlannerActions() {
  const {
    setShowExportModal,
    setShowMajorSelectionModal,
    setShowMajorProgressModal,
  } = useContext(ModalsContext);
  return (
    <Card variant="plain" className="flex flex-col gap-1">
      <Button onClick={() => setShowExportModal(true)} variant="plain">
        <div className="flex flex-row gap-1 items-center">
          <FileDownloadIcon fontSize="large" />
          <div>Export Plan</div>
        </div>
      </Button>
      <Button onClick={() => setShowMajorSelectionModal(true)} variant="plain">
        <div className="flex flex-row gap-1 items-center">
          <EditIcon fontSize="large" />
          <div>Edit Major</div>
        </div>
      </Button>
      <Button onClick={() => setShowMajorProgressModal(true)} variant="plain">
        Major Progress
      </Button>
    </Card>
  );
}

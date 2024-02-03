import { ModalsContext } from "@contexts/ModalsProvider";
import EditIcon from "@mui/icons-material/Edit";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Button, Card, Tooltip } from "@mui/joy";
import { useSession } from "next-auth/react";
import { useContext } from "react";

export default function PlannerActions() {
  const { setShowExportModal, setShowMajorSelectionModal } =
    useContext(ModalsContext);
  const session = useSession();
  return (
    <Card variant="plain" className="flex flex-col gap-1">
      <Button onClick={() => setShowExportModal(true)} variant="plain">
        <div className="flex flex-row gap-1 items-center">
          <FileDownloadIcon fontSize="large" />
          <div>Export Plan</div>
        </div>
      </Button>
      {session.status === "authenticated" ? (
        <Button
          onClick={() => setShowMajorSelectionModal(true)}
          variant="plain"
        >
          <div className="flex flex-row gap-1 items-center">
            <EditIcon fontSize="large" />
            <div>Edit Major</div>
          </div>
        </Button>
      ) : (
        <Tooltip title="⚠️ Log in to edit major">
          <span className="text-center">
            <Button variant="plain" disabled>
              <div className="flex flex-row gap-1 items-center">
                <EditIcon fontSize="large" />
                <div>Edit Major</div>
              </div>
            </Button>
          </span>
        </Tooltip>
      )}
    </Card>
  );
}

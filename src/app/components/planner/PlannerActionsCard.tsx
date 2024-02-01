import { PlannerContext } from "@/app/contexts/PlannerProvider";
import { ModalsContext } from "@contexts/ModalsProvider";
import { SaveRounded } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Button, Card } from "@mui/joy";
import { useSession } from "next-auth/react";
import { useContext } from "react";

import ShortcutTooltip from "./ShortcutTooltip";

export default function PlannerActions() {
  const { setShowExportModal, setShowMajorSelectionModal } =
    useContext(ModalsContext);
  const session = useSession();
  const { savePlanner } = useContext(PlannerContext);
  return (
    <Card variant="plain" className="flex flex-col gap-1">
      {session.status === "authenticated" ? (
        <ShortcutTooltip title="Save Planner" shortcut="S">
          <Button onClick={savePlanner} variant="plain">
            <div className="flex flex-row gap-1 items-center">
              <SaveRounded fontSize="large" />
              Save Plan
            </div>
          </Button>
        </ShortcutTooltip>
      ) : null}
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
    </Card>
  );
}

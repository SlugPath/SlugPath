import { Button, Card } from "@mui/joy";
import { useContext } from "react";
import { ModalsContext } from "../../contexts/ModalsProvider";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import EditIcon from "@mui/icons-material/Edit";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import SchoolIcon from "@mui/icons-material/School";

export default function PlannerActions() {
  const {
    setShowExportModal,
    setShowMajorSelectionModal,
    setShowMajorProgressModal,
    setShowPermissionsModal,
  } = useContext(ModalsContext);

  const buttons = [
    {
      name: "Export Plan",
      icon: <FileDownloadIcon fontSize="large" />,
      onClick: () => setShowExportModal(true),
    },
    {
      name: "Edit Major",
      icon: <EditIcon fontSize="large" />,
      onClick: () => setShowMajorSelectionModal(true),
    },
    {
      name: "Major Progress",
      icon: <SchoolIcon fontSize="large" />,
      onClick: () => setShowMajorProgressModal(true),
    },
    {
      name: "Permissions",
      icon: <LockOpenIcon fontSize="large" />,
      onClick: () => setShowPermissionsModal(true),
    },
  ];

  return (
    <Card variant="plain" className="flex flex-col gap-1">
      {buttons.map((button, index) => (
        <Button onClick={button.onClick} variant="plain" key={index}>
          <div className="flex flex-row gap-1 items-center">
            {button.icon}
            <div>{button.name}</div>
          </div>
        </Button>
      ))}
    </Card>
  );
}

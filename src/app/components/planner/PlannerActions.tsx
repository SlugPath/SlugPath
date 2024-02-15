import { ModalsContext } from "@contexts/ModalsProvider";
import { PermissionsContext } from "@contexts/PermissionsProvider";
import EditIcon from "@mui/icons-material/Edit";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import SchoolIcon from "@mui/icons-material/School";
import { Button, Card, Typography } from "@mui/joy";
import { useSession } from "next-auth/react";
import { useContext } from "react";

export default function PlannerActions() {
  const {
    setShowExportModal,
    setShowMajorSelectionModal,
    setShowMajorProgressModal,
    setShowPermissionsModal,
  } = useContext(ModalsContext);
  const { isAdmin } = useContext(PermissionsContext);
  const { status } = useSession();

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
      disabled: status !== "authenticated",
    },
    {
      name: "Major Progress",
      icon: <SchoolIcon fontSize="large" />,
      onClick: () => setShowMajorProgressModal(true),
      disabled: status !== "authenticated",
    },
  ];

  if (isAdmin) {
    buttons.push({
      name: "Permissions",
      icon: <LockOpenIcon fontSize="large" />,
      onClick: () => setShowPermissionsModal(true),
    });
  }

  return (
    <Card variant="plain" className="flex flex-col gap-1">
      {buttons.map((button, index) => (
        <Button
          onClick={button.onClick}
          variant="plain"
          key={index}
          startDecorator={button.icon}
          disabled={button.disabled}
        >
          <Typography>{button.name}</Typography>
        </Button>
      ))}
    </Card>
  );
}
